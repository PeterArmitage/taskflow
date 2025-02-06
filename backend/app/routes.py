from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import shutil
import os
import secrets
from . import models, schemas, auth
from .database import get_db
from datetime import datetime, timedelta, timezone
from typing import List, Optional
from sqlalchemy import func, desc, or_, asc, and_
from .exceptions import NotFoundException, ForbiddenException, BadRequestException
from .models import PermissionLevel
import logging
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr, BaseModel
from .auth import authenticate_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from dotenv import load_dotenv
from .websocket import handle_websocket, manager
from fastapi import WebSocket, WebSocketDisconnect
from .auth import get_user_from_token
from .config import SECRET_KEY, ALGORITHM

load_dotenv()

logger = logging.getLogger(__name__)
UPLOAD_DIR = "uploads"
# Create an APIRouter instance
router = APIRouter()
email_config = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

# In routes.py
@router.websocket("/ws/cards/{card_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    card_id: int,
    db: Session = Depends(get_db)
):
    # Extract token from query parameters
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=4000)
        return

    # Verify user
    user = await get_user_from_token(token, db)
    if not user:
        await websocket.close(code=4001)
        return

    # Verify card access
    card = (
        db.query(models.Card)
        .join(models.List)
        .join(models.Board)
        .outerjoin(models.BoardMember)
        .filter(
            models.Card.id == card_id,
            or_(
                models.Board.owner_id == user.id,
                models.BoardMember.user_id == user.id
            )
        )
        .first()
    )

    if not card:
        await websocket.close(code=4002)
        return

    # Connect only if all checks passed
    await manager.connect(websocket, card_id, user.id)

fastmail = FastMail(email_config)


@router.websocket("/ws/test")
async def test_endpoint(websocket: WebSocket):
    await websocket.accept()
    await websocket.send_json({"message": "Connection successful!"})
    await websocket.close()




# Board routes

# Create a new board
@router.post("/boards/", response_model=schemas.Board)
def create_board(board: schemas.BoardCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    db_board = models.Board(**board.model_dump(), owner_id=current_user.id)
    db.add(db_board)
    db.commit()
    db.refresh(db_board)
    return db_board

# Get all boards with pagination
@router.get("/boards/", response_model=list[schemas.Board])
def read_boards(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    boards = db.query(models.Board).offset(skip).limit(limit).all()
    return boards

# Get a specific board by ID

@router.get("/boards/{board_id}", response_model=schemas.Board)
def read_board(
    board_id: int, 
    current_user: models.User = Depends(auth.get_current_user), 
    db: Session = Depends(get_db)
):
    # Add debug logging
    print(f"Fetching board {board_id} for user {current_user.id}")
    
    # Get the board with owner check
    board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")

    # Check permissions
    if board.owner_id != current_user.id:
        member = db.query(models.BoardMember).filter(
            models.BoardMember.board_id == board_id,
            models.BoardMember.user_id == current_user.id
        ).first()
        if not member:
            raise HTTPException(
                status_code=403, 
                detail="Not authorized to access this board"
            )

    # Get lists with cards in a single query to improve performance
    lists = (
        db.query(models.List)
        .filter(models.List.board_id == board_id)
        .order_by(models.List.created_at)
        .all()
    )
    
    # Log the found lists
    print(f"Found {len(lists)} lists for board {board_id}")

    # Load cards for each list
    for list_item in lists:
        cards = (
            db.query(models.Card)
            .filter(models.Card.list_id == list_item.id)
            .order_by(models.Card.created_at)
            .all()
        )
        list_item.cards = cards
        print(f"Found {len(cards)} cards for list {list_item.id}")

    # Attach lists to board
    board.lists = lists

    # Log the final board state
    print(f"Returning board with {len(board.lists)} lists")
    return board

# Update a board
@router.put("/boards/{board_id}", response_model=schemas.Board)
def update_board(
    board_id: int, 
    board: schemas.BoardUpdate, 
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    logger.info(f"Updating board {board_id} for user {current_user.username} (id: {current_user.id})")
    
    db_board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if db_board is None:
        raise HTTPException(status_code=404, detail="Board not found")
    
    logger.info(f"Board owner_id: {db_board.owner_id}, Current user id: {current_user.id}")
    
    if db_board.owner_id != current_user.id:
        member = db.query(models.BoardMember).filter(
            models.BoardMember.board_id == board_id,
            models.BoardMember.user_id == current_user.id
        ).first()
        
        logger.info(f"Board member found: {member}")
        if member:
            logger.info(f"Member permission level: {member.permission_level}")
            
        if not member or member.permission_level == PermissionLevel.VIEW:
            logger.warning(f"User {current_user.id} not authorized to update board {board_id}")
            raise ForbiddenException(detail="Not authorized to update this board")
    
    for var, value in vars(board).items():
        setattr(db_board, var, value) if value else None
    db.add(db_board)
    db.commit()
    db.refresh(db_board)
    logger.info(f"Board {board_id} updated successfully")
    return db_board

@router.get("/boards/{board_id}/members", response_model=List[schemas.BoardMember])
def get_board_members(
    board_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
        
    if board.owner_id != current_user.id:
        member = db.query(models.BoardMember).filter(
            models.BoardMember.board_id == board_id,
            models.BoardMember.user_id == current_user.id
        ).first()
        if not member:
            raise ForbiddenException(detail="Not authorized to view this board's members")
            
    members = db.query(models.BoardMember).filter(models.BoardMember.board_id == board_id).all()
    return members

# Delete a board
@router.delete("/boards/{board_id}", response_model=schemas.Board)
def delete_board(
    board_id: int, 
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    db_board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if db_board is None:
        raise HTTPException(status_code=404, detail="Board not found")
    
    if db_board.owner_id != current_user.id:
        raise ForbiddenException(detail="Not authorized to delete this board")
    
    db.delete(db_board)
    db.commit()
    return db_board

# Get all lists for a specific board
@router.get("/boards/{board_id}/lists", response_model=list[schemas.List])
def read_lists_for_board(
    board_id: int, 
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if board is None:
        raise HTTPException(status_code=404, detail="Board not found")
    
    if board.owner_id != current_user.id:
        member = db.query(models.BoardMember).filter(
            models.BoardMember.board_id == board_id,
            models.BoardMember.user_id == current_user.id
        ).first()
        if not member:
            raise ForbiddenException(detail="Not authorized to access this board")
    
    lists = db.query(models.List).filter(models.List.board_id == board_id).all()
    return lists

# Get board activity
@router.get("/boards/{board_id}/activity", response_model=List[schemas.Activity])
async def get_board_activity(
    board_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    
    if board.owner_id != current_user.id:
        member = db.query(models.BoardMember).filter(
            models.BoardMember.board_id == board_id,
            models.BoardMember.user_id == current_user.id
        ).first()
        if not member:
            raise ForbiddenException(detail="Not authorized to access this board")
    
    activities = db.query(models.Activity).filter(models.Activity.board_id == board_id).order_by(models.Activity.created_at.desc()).limit(50).all()
    return activities

# Get board statistics
@router.get("/boards/{board_id}/statistics", response_model=schemas.BoardStatistics)
async def get_board_statistics(
    board_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    
    if board.owner_id != current_user.id:
        member = db.query(models.BoardMember).filter(
            models.BoardMember.board_id == board_id,
            models.BoardMember.user_id == current_user.id
        ).first()
        if not member:
            raise ForbiddenException(detail="Not authorized to access this board")
    
    list_stats = db.query(
        models.List.title,
        func.count(models.Card.id).label('card_count')
    ).outerjoin(models.Card).filter(models.List.board_id == board_id).group_by(models.List.id).all()
    
    total_cards = sum(stat.card_count for stat in list_stats)
    
    return schemas.BoardStatistics(
        total_lists=len(list_stats),
        total_cards=total_cards,
        lists_statistics=[schemas.ListStatistics(name=stat.title, card_count=stat.card_count) for stat in list_stats]
    )
@router.get("/boards/{board_id}/cards", response_model=List[schemas.Card])
async def get_board_cards(
    board_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if not board:
        raise NotFoundException(detail="Board not found")
    
    if board.owner_id != current_user.id:
        member = db.query(models.BoardMember).filter(
            models.BoardMember.board_id == board_id,
            models.BoardMember.user_id == current_user.id
        ).first()
        if not member:
            raise ForbiddenException(detail="Not authorized to access this board")
    
    cards = db.query(models.Card).join(models.List).filter(models.List.board_id == board_id).all()
    return cards

# Get all cards for a specific board
@router.get("/boards/{board_id}", response_model=schemas.Board)
def read_board(board_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if board is None:
        raise NotFoundException(detail="Board not found")
    
    if board.owner_id != current_user.id:
        member = db.query(models.BoardMember).filter(
            models.BoardMember.board_id == board_id,
            models.BoardMember.user_id == current_user.id
        ).first()
        if not member:
            raise ForbiddenException(detail="Not authorized to access this board")
    
    return board

@router.post("/board-templates", response_model=schemas.BoardTemplate)
async def create_board_template(
    template: schemas.BoardTemplateCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    db_template = models.BoardTemplate(**template.model_dump(), created_by=current_user.id)
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

@router.post("/boards/from-template/{template_id}", response_model=schemas.Board)
async def create_board_from_template(
    template_id: int,
    board_name: str,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    template = db.query(models.BoardTemplate).filter(models.BoardTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    new_board = models.Board(title=board_name, owner_id=current_user.id)
    db.add(new_board)
    db.flush()

    for list_template in template.lists:
        new_list = models.List(title=list_template.name, board_id=new_board.id)
        db.add(new_list)

    db.commit()
    db.refresh(new_board)
    return new_board

@router.post("/boards/{board_id}/members", response_model=schemas.BoardMember)
def add_board_member(
    board_id: int,
    member: schemas.BoardMemberCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    board = db.query(models.Board).filter(models.Board.id == board_id, models.Board.owner_id == current_user.id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found or you don't have permission")
    
    new_member = models.BoardMember(**member.model_dump(), board_id=board_id)
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member

@router.put("/boards/{board_id}/members/{user_id}", response_model=schemas.BoardMember)
def update_board_member_permission(
    board_id: int,
    user_id: int,
    permission: PermissionLevel,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    board = db.query(models.Board).filter(models.Board.id == board_id, models.Board.owner_id == current_user.id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found or you don't have permission")
    
    member = db.query(models.BoardMember).filter(models.BoardMember.board_id == board_id, models.BoardMember.user_id == user_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Board member not found")
    
    member.permission_level = permission
    db.commit()
    db.refresh(member)
    return member

@router.delete("/boards/{board_id}/members/{user_id}", status_code=204)
def remove_board_member(
    board_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    board = db.query(models.Board).filter(models.Board.id == board_id, models.Board.owner_id == current_user.id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found or you don't have permission")
    
    member = db.query(models.BoardMember).filter(models.BoardMember.board_id == board_id, models.BoardMember.user_id == user_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Board member not found")
    
    db.delete(member)
    db.commit()
    return {"detail": "Board member removed successfully"}
   
# List routes
# Create a new list
@router.post("/lists/", response_model=schemas.List)
def create_list(list: schemas.ListCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    db_list = models.List(**list.model_dump())
    db.add(db_list)
    db.commit()
    db.refresh(db_list)
    
    # Log activity
    activity = models.Activity(
        board_id=db_list.board_id,
        user_id=current_user.id,
        activity_type="list_created",
        details=f"List '{db_list.title}' created"
    )
    db.add(activity)
    db.commit()
    
    return db_list

# Get all lists with pagination
@router.get("/lists/", response_model=list[schemas.List])
def read_lists(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Query the database for lists, applying offset and limit for pagination
    lists = db.query(models.List).offset(skip).limit(limit).all()
    # Return the retrieved lists
    return lists

# Get a specific list by ID
@router.get("/lists/{list_id}", response_model=schemas.List)
def read_list(list_id: int, db: Session = Depends(get_db)):
    # Query the database for a list with the given ID
    db_list = db.query(models.List).filter(models.List.id == list_id).first()
    # If the list is not found, raise a 404 error
    if db_list is None:
        raise HTTPException(status_code=404, detail="List not found")
    # Return the found list
    return db_list

# Update a specific list
@router.put("/lists/{list_id}", response_model=schemas.List)
def update_list(
    list_id: int,
    list_data: schemas.ListUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    print(f"Updating list {list_id} with data:", list_data.model_dump())  # Debug log
    
    # Get the list and verify ownership
    db_list = (
        db.query(models.List)
        .join(models.Board)
        .filter(
            models.List.id == list_id,
            models.Board.owner_id == current_user.id
        )
        .first()
    )
    
    if not db_list:
        raise HTTPException(
            status_code=404,
            detail="List not found or you don't have permission"
        )
    
    # Update only the provided fields
    update_data = list_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_list, key, value)
    
    try:
        db.commit()
        db.refresh(db_list)
        print("List updated successfully:", db_list)  # Debug log
        return db_list
    except Exception as e:
        db.rollback()
        print("Error updating list:", str(e))  # Debug log
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/lists/{list_id}", response_model=schemas.List)
def delete_list(
    list_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    print(f"Deleting list {list_id}")  # Debug log
    
    # Get the list and verify ownership
    db_list = (
        db.query(models.List)
        .join(models.Board)
        .filter(
            models.List.id == list_id,
            models.Board.owner_id == current_user.id
        )
        .first()
    )
    
    if not db_list:
        raise HTTPException(
            status_code=404,
            detail="List not found or you don't have permission"
        )
    
    try:
        db.delete(db_list)
        db.commit()
        print("List deleted successfully")  # Debug log
        return {"detail": "List deleted successfully"}
    except Exception as e:
        db.rollback()
        print("Error deleting list:", str(e))  # Debug log
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/lists/{list_id}/cards", response_model=list[schemas.Card])
def read_cards_for_list(
    list_id: int,
    due_date: Optional[datetime] = None,
    sort_by: Optional[str] = Query(None, enum=["created_at", "due_date"]),
    sort_order: Optional[str] = Query("asc", enum=["asc", "desc"]),
    db: Session = Depends(get_db)
):
    query = db.query(models.Card).filter(models.Card.list_id == list_id)

    if due_date:
        query = query.filter(models.Card.due_date <= due_date)

    if sort_by:
        order = desc if sort_order == "desc" else asc
        query = query.order_by(order(getattr(models.Card, sort_by)))

    cards = query.all()
    return cards

# Card routes
@router.post("/cards/", response_model=schemas.Card)
def create_card(card: schemas.CardCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    list = db.query(models.List).filter(models.List.id == card.list_id).first()
    if not list:
        raise HTTPException(status_code=404, detail="List not found")
    
    db_card = models.Card(**card.model_dump())
    db.add(db_card)
    db.commit()
    db.refresh(db_card)

    # Log activity
    activity = models.Activity(
        board_id=list.board_id,
        user_id=current_user.id,
        activity_type="card_created",
        details=f"Card '{db_card.title}' created in list '{list.title}'"
    )
    db.add(activity)
    db.commit()

    return db_card

@router.get("/cards/", response_model=list[schemas.Card])
def read_cards(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    cards = db.query(models.Card).offset(skip).limit(limit).all()
    return cards

@router.get("/cards/{card_id}", response_model=schemas.Card)
def read_card(card_id: int, db: Session = Depends(get_db)):
    db_card = db.query(models.Card).filter(models.Card.id == card_id).first()
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    return db_card

@router.put("/cards/{card_id}", response_model=schemas.Card)
def update_card(card_id: int, card: schemas.CardUpdate, db: Session = Depends(get_db)):
    db_card = db.query(models.Card).filter(models.Card.id == card_id).first()
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    for var, value in vars(card).items():
        setattr(db_card, var, value) if value is not None else None
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card

@router.delete("/cards/{card_id}", response_model=schemas.Card)
def delete_card(card_id: int, db: Session = Depends(get_db)):
    db_card = db.query(models.Card).filter(models.Card.id == card_id).first()
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    db.delete(db_card)
    db.commit()
    return db_card

@router.put("/cards/{card_id}/move", response_model=schemas.Card)
async def move_card(
    card_id: int,
    new_list_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    print(f"Moving card {card_id} to list {new_list_id} for user {current_user.id}")
    card = db.query(models.Card).filter(models.Card.id == card_id).first()
    if not card:
        print(f"Card {card_id} not found")
        raise HTTPException(status_code=404, detail="Card not found")

    # Check if the user has permission to move this card
    board = db.query(models.Board).join(models.List).filter(models.List.id == card.list_id).first()
    print(f"Board owner_id: {board.owner_id}, Current user id: {current_user.id}")
    if not board or board.owner_id != current_user.id:
        print(f"User {current_user.id} not authorized to move card {card_id}")
        raise HTTPException(status_code=403, detail="Not authorized to move this card")

    # Check if the new list exists and belongs to the same board
    new_list = db.query(models.List).filter(models.List.id == new_list_id, models.List.board_id == board.id).first()
    if not new_list:
        raise HTTPException(status_code=400, detail="Invalid new list ID")

    # Move the card
    card.list_id = new_list_id
    db.commit()
    db.refresh(card)

    return card

@router.post("/cards/{card_id}/labels", response_model=schemas.Label)
async def create_label(
    card_id: int,
    label: schemas.LabelCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Check if card exists and user has access
    card = db.query(models.Card).join(models.List).join(models.Board).filter(
        models.Card.id == card_id,
        models.Board.owner_id == current_user.id
    ).first()
    
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    db_label = models.Label(**label.dict(), card_id=card_id)
    db.add(db_label)
    db.commit()
    db.refresh(db_label)
    return db_label

@router.delete("/labels/{label_id}")
async def delete_label(
    label_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    label = db.query(models.Label).join(models.Card).join(models.List).join(models.Board).filter(
        models.Label.id == label_id,
        models.Board.owner_id == current_user.id
    ).first()
    
    if not label:
        raise HTTPException(status_code=404, detail="Label not found")
    
    db.delete(label)
    db.commit()
    return {"detail": "Label deleted successfully"}

@router.get("/cards/{card_id}/labels", response_model=List[schemas.Label])
async def get_card_labels(
    card_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    card = db.query(models.Card).join(models.List).join(models.Board).filter(
        models.Card.id == card_id,
        models.Board.owner_id == current_user.id
    ).first()
    
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
    return card.labels

@router.delete("/cards/{card_id}/labels/{label_id}", response_model=schemas.Card)
def remove_label_from_card(
    card_id: int, 
    label_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    card = db.query(models.Card).join(models.List).join(models.Board).filter(
        models.Card.id == card_id,
        models.Board.owner_id == current_user.id
    ).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
    label = db.query(models.Label).filter(models.Label.id == label_id, models.Label.card_id == card_id).first()
    if not label:
        raise HTTPException(status_code=404, detail="Label not found")
    
    db.delete(label)
    db.commit()
    db.refresh(card)
    return card

@router.post("/cards/batch", response_model=List[schemas.Card])
def create_cards_batch(
    cards: List[schemas.CardCreate],
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    created_cards = []
    for card_data in cards:
        # Verify that the user has access to the list
        list_obj = db.query(models.List).join(models.Board).filter(
            models.List.id == card_data.list_id,
            models.Board.owner_id == current_user.id
        ).first()
        if not list_obj:
            raise HTTPException(status_code=404, detail="List not found or access denied")
        
        db_card = models.Card(**card_data.model_dump())
        db.add(db_card)
        created_cards.append(db_card)
    
    db.commit()
    for card in created_cards:
        db.refresh(card)
    
    return created_cards

@router.post("/cards/{card_id}/attachments", response_model=schemas.Attachment)
async def add_attachment(
    card_id: int,
    file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    card = db.query(models.Card).join(models.List).join(models.Board).filter(
        models.Card.id == card_id,
        models.Board.owner_id == current_user.id
    ).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found or access denied")

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    db_attachment = models.Attachment(filename=file.filename, file_path=file_path, card_id=card.id)
    db.add(db_attachment)
    db.commit()
    db.refresh(db_attachment)

    return db_attachment

@router.get("/cards/{card_id}/attachments", response_model=List[schemas.Attachment])
async def get_attachments(
    card_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    card = db.query(models.Card).join(models.List).join(models.Board).filter(
        models.Card.id == card_id,
        models.Board.owner_id == current_user.id
    ).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found or access denied")

    return card.attachments

@router.post("/cards/{card_id}/comments", response_model=schemas.Comment)
def add_comment_to_card(
    card_id: int,
    comment: schemas.CommentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    card = db.query(models.Card).join(models.List).join(models.Board).filter(
        models.Card.id == card_id,
        models.Board.owner_id == current_user.id
    ).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
    new_comment = models.Comment(**comment.model_dump(), card_id=card_id, user_id=current_user.id)
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment

@router.get("/cards/{card_id}/comments", response_model=List[schemas.Comment])
def get_card_comments(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    card = db.query(models.Card).join(models.List).join(models.Board).filter(
        models.Card.id == card_id,
        models.Board.owner_id == current_user.id
    ).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
    return card.comments

#users

@router.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Add logging
    print("Received user data:", user.model_dump())
    
    # Check for existing user
    db_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()
    
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    db_user = models.User(
        username=user.email,  # Use email as username
        email=user.email,
        hashed_password=auth.get_password_hash(user.password)
    )
    
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        print("Database error:", str(e))
        raise HTTPException(status_code=400, detail="Could not create user")

@router.get("/users/me/", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@router.get("/users/me/boards", response_model=List[schemas.Board])
async def read_user_boards(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    boards = db.query(models.Board).filter(models.Board.owner_id == current_user.id).all()
    return boards

#token

@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    print(f"Login attempt for: {form_data.username}")
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

#search
@router.get("/search", response_model=List[schemas.SearchResult])
async def search(
    query: str,
    due_date_start: Optional[datetime] = None,
    due_date_end: Optional[datetime] = None,
    label: Optional[str] = None,
    board_id: Optional[int] = None,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Base query for boards
    board_query = db.query(models.Board).filter(models.Board.owner_id == current_user.id)
    
    # Apply board_id filter if provided
    if board_id:
        board_query = board_query.filter(models.Board.id == board_id)
    
    # Search in boards
    boards = board_query.filter(models.Board.title.ilike(f"%{query}%")).all()

    # Search in lists
    lists = db.query(models.List).join(models.Board).filter(
        models.Board.owner_id == current_user.id,
        models.List.title.ilike(f"%{query}%")
    ).all()

    # Base query for cards
    card_query = db.query(models.Card).join(models.List).join(models.Board).filter(
        models.Board.owner_id == current_user.id
    )
    
    # Apply filters
    if due_date_start:
        card_query = card_query.filter(models.Card.due_date >= due_date_start)
    if due_date_end:
        card_query = card_query.filter(models.Card.due_date <= due_date_end)
    if label:
        card_query = card_query.join(models.Label).filter(models.Label.name == label)
    if board_id:
        card_query = card_query.filter(models.Board.id == board_id)

    # Full-text search on cards
    cards = card_query.filter(
        or_(
            models.Card.title.ilike(f"%{query}%"),
            models.Card.description.ilike(f"%{query}%")
        )
    ).all()

    results = [
        *[schemas.SearchResult(type="board", id=b.id, title=b.title) for b in boards],
        *[schemas.SearchResult(type="list", id=l.id, title=l.title) for l in lists],
        *[schemas.SearchResult(type="card", id=c.id, title=c.title) for c in cards]
    ]

    return results



@router.post("/password-reset/request", status_code=status.HTTP_200_OK)
async def request_password_reset(
    email: EmailStr,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        # Return 200 even if user not found for security
        return {"message": "If a user with that email exists, a password reset link has been sent."}

    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    user.password_reset_token = reset_token
    user.password_reset_expires = datetime.now(timezone.utc) + timedelta(hours=1)
    db.commit()

    # Create reset link
    reset_url = f"{os.getenv('FRONTEND_URL')}/reset-password/{reset_token}"

    # Create email message
    message = MessageSchema(
        subject="Password Reset Request",
        recipients=[email],
        body=f"""
        Hi {user.username},

        You requested to reset your password. Click the link below to reset it:

        {reset_url}

        This link will expire in 1 hour.

        If you didn't request this, please ignore this email.
        """,
    )

    # Send email in background
    background_tasks.add_task(fastmail.send_message, message)

    return {"message": "Password reset email sent successfully"}

@router.get("/password-reset/verify/{token}", status_code=status.HTTP_200_OK)
async def verify_reset_token(token: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.password_reset_token == token,
        models.User.password_reset_expires > datetime.now(timezone.utc)
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )

    return {"message": "Valid reset token"}

@router.post("/password-reset/request", status_code=status.HTTP_200_OK)
async def request_password_reset(
    email: EmailStr,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        # Return 200 even if user not found for security
        return {"message": "If a user with that email exists, a password reset link has been sent."}

    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    user.password_reset_token = reset_token
    user.password_reset_expires = datetime.now(timezone.utc) + timedelta(hours=1)
    db.commit()

    # Create reset link
    reset_url = f"{os.getenv('FRONTEND_URL')}/reset-password/{reset_token}"

    # Create email message
    message = MessageSchema(
        subject="Password Reset Request",
        recipients=[email],
        body=f"""
        Hi {user.username},

        You requested to reset your password. Click the link below to reset it:

        {reset_url}

        This link will expire in 1 hour.

        If you didn't request this, please ignore this email.
        """,
        subtype=MessageType.plain
    )

    # Send email immediately (changed from background task for better error handling)
    try:
        await fastmail.send_message(message)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send reset email: {str(e)}"
        )

    return {"message": "Password reset email sent successfully"}

# Add this temporarily to your routes.py for testing

@router.post("/test-email/")
async def test_email(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    try:
        message = MessageSchema(
            subject="Test Email from TaskFlow",
            recipients=[os.getenv("MAIL_FROM")],  
            body="""
            This is a test email from your TaskFlow application.
            If you receive this, your email configuration is working!
            """,
            subtype=MessageType.plain  
        )
        
        await fastmail.send_message(message)
        return {"message": "Test email sent successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send email: {str(e)}"
        )

@router.put("/users/{user_id}", response_model=schemas.User)
async def update_user(
    user_id: int,
    user_data: schemas.UserUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id != user_id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to update this user"
        )
    
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update user fields
    for var, value in vars(user_data).items():
        if value is not None:
            setattr(db_user, var, value)
    
    try:
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/users/{user_id}/avatar", response_model=schemas.User)
async def update_user_avatar(
    user_id: int,
    file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id != user_id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to update this user's avatar"
        )
    
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Save the file
    file_path = f"uploads/avatars/{user_id}_{file.filename}"
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    try:
        with open(file_path, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Could not upload file: {str(e)}"
        )
    
    
    db_user.avatar_url = file_path
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.post("/checklists/", response_model=schemas.Checklist)
async def create_checklist(
    checklist: schemas.ChecklistCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Verify user has access to the card
    card = db.query(models.Card).join(models.List).join(models.Board).filter(
        models.Card.id == checklist.card_id,
        models.Board.owner_id == current_user.id
    ).first()
    
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
        
    db_checklist = models.Checklist(**checklist.model_dump())
    db.add(db_checklist)
    db.commit()
    db.refresh(db_checklist)
    return db_checklist

@router.post("/checklist-items/", response_model=schemas.ChecklistItem)
async def create_checklist_item(
    item: schemas.ChecklistItemCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Verify user has access to the checklist
    checklist = db.query(models.Checklist).join(models.Card).join(models.List).join(models.Board).filter(
        models.Checklist.id == item.checklist_id,
        models.Board.owner_id == current_user.id
    ).first()
    
    if not checklist:
        raise HTTPException(status_code=404, detail="Checklist not found")
        
    db_item = models.ChecklistItem(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.put("/checklist-items/{item_id}", response_model=schemas.ChecklistItem)
async def update_checklist_item(
    item_id: int,
    item_update: schemas.ChecklistItemUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Get the item and verify user has access
    db_item = db.query(models.ChecklistItem).join(models.Checklist).join(models.Card).join(models.List).join(models.Board).filter(
        models.ChecklistItem.id == item_id,
        models.Board.owner_id == current_user.id
    ).first()
    
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    for key, value in item_update.model_dump(exclude_unset=True).items():
        setattr(db_item, key, value)
        
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/checklist-items/{item_id}")
async def delete_checklist_item(
    item_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Get the item and verify user has access
    db_item = db.query(models.ChecklistItem).join(models.Checklist).join(models.Card).join(models.List).join(models.Board).filter(
        models.ChecklistItem.id == item_id,
        models.Board.owner_id == current_user.id
    ).first()
    
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    db.delete(db_item)
    db.commit()
    return {"detail": "Item deleted successfully"}


@router.put("/checklists/{checklist_id}", response_model=schemas.Checklist)
async def update_checklist(
    checklist_id: int,
    checklist_update: schemas.ChecklistUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Verify user has access to the checklist
    checklist = db.query(models.Checklist).join(models.Card).join(models.List).join(models.Board).filter(
        models.Checklist.id == checklist_id,
        models.Board.owner_id == current_user.id
    ).first()
    
    if not checklist:
        raise HTTPException(status_code=404, detail="Checklist not found")
        
    for key, value in checklist_update.model_dump(exclude_unset=True).items():
        setattr(checklist, key, value)
        
    db.commit()
    db.refresh(checklist)
    return checklist

@router.delete("/checklists/{checklist_id}")
async def delete_checklist(
    checklist_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    checklist = db.query(models.Checklist).join(models.Card).join(models.List).join(models.Board).filter(
        models.Checklist.id == checklist_id,
        models.Board.owner_id == current_user.id
    ).first()
    
    if not checklist:
        raise HTTPException(status_code=404, detail="Checklist not found")
        
    db.delete(checklist)
    db.commit()
    return {"detail": "Checklist deleted successfully"}