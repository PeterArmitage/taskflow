from pydantic import BaseModel, Field, EmailStr, model_validator
from datetime import datetime
from typing import Annotated, List as PyList, Optional, Any, Dict
from enum import Enum
from pydantic.config import ConfigDict
from .models import PermissionLevel

class PermissionLevel(str, Enum):
    VIEW = "view"
    EDIT = "edit"
    ADMIN = "admin"
    
class BoardBase(BaseModel):
    title: str

class BoardCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)

class BoardUpdate(BoardBase):
    title: Optional[str] = None


class ListBase(BaseModel):
    title: str
    board_id: int

class ListCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    board_id: int = Field(..., gt=0)

class ListUpdate(BaseModel):
    title: Annotated[str, Field(min_length=1, max_length=100)]
    board_id: Optional[int] = None
    position: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

    # New way to validate in Pydantic v2
    @model_validator(mode='before')
    @classmethod
    def validate_fields(cls, values):
        if title := values.get('title'):
            if not title.strip():
                raise ValueError('Title cannot be empty')
            values['title'] = title.strip()
        return values

class CardBase(BaseModel):
    title: str
    description: Optional[str] = None
    list_id: int
    due_date: Optional[datetime] = None

class CardCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=1000)
    list_id: int = Field(..., gt=0)
    due_date: Optional[datetime] = None

class CardUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    list_id: Optional[int] = None
    due_date: Optional[datetime] = None

class Card(CardBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    due_date: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)
        
class CardMove(BaseModel):
    new_list_id: int
            
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime

class ActivityType(str, Enum):
    CARD_CREATED = "card_created"
    CARD_MOVED = "card_moved"
    CARD_ARCHIVED = "card_archived"
    LIST_CREATED = "list_created"
    
class Activity(BaseModel):
    id: int
    board_id: int
    user_id: int
    activity_type: ActivityType
    details: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)  
    
class SearchResult(BaseModel):
    type: str
    id: int
    title: str

    model_config = ConfigDict(from_attributes=True)
    
class Attachment(BaseModel):
    id: int
    filename: str
    file_path: str
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)

class BoardTemplateCreate(BaseModel):
    name: str
    description: str
    lists: PyList[str]

class BoardTemplate(BoardTemplateCreate):
    id: int
    created_by: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)    

class ListStatistics(BaseModel):
    name: str
    card_count: int

class BoardStatistics(BaseModel):
    total_lists: int
    total_cards: int
    lists_statistics: PyList[ListStatistics]

    model_config = ConfigDict(from_attributes=True)    
    
class LabelCreate(BaseModel):
    name: str
    color: str

class Label(LabelCreate):
    id: int
    card_id: int

    model_config = ConfigDict(from_attributes=True)   
 
class LabelBase(BaseModel):
    name: str
    color: str
    type: Optional[str] = None
    description: Optional[str] = None

class LabelCreate(LabelBase):
    pass

class Label(LabelBase):
    id: int
    card_id: int
    
    
    class Config:
        from_attributes = True
    
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)     
    
class CommentCreate(BaseModel):
    content: str

class Comment(CommentCreate):
    id: int
    card_id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)  
    
class BoardMemberCreate(BaseModel):
    user_id: int
    permission_level: str

class BoardMember(BoardMemberCreate):
    id: int
    board_id: int

    model_config = ConfigDict(from_attributes=True)      
    
class PasswordReset(BaseModel):
    new_password: str    
    
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    bio: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)    
    
class List(ListBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    cards: PyList[Card] = []
    model_config = ConfigDict(from_attributes=True)   
    
class Board(BoardBase):
    id: int
    description: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    lists: PyList[List] = []  

    model_config = ConfigDict(from_attributes=True)
    

class ChecklistItemBase(BaseModel):
    content: str
    position: Optional[int] = None
    completed: Optional[bool] = False

class ChecklistItemCreate(ChecklistItemBase):
    checklist_id: int

class ChecklistItemUpdate(BaseModel):
    content: Optional[str] = None
    completed: Optional[bool] = None
    position: Optional[int] = None

class ChecklistItem(ChecklistItemBase):
    id: int
    checklist_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class ChecklistBase(BaseModel):
    title: str
    position: Optional[int] = None

class ChecklistCreate(ChecklistBase):
    card_id: int

class ChecklistUpdate(BaseModel):
    title: Optional[str] = None
    position: Optional[int] = None

class Checklist(ChecklistBase):
    id: int
    card_id: int
    items: PyList[ChecklistItem] = []
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# Update the Card schema to include checklists
class Card(CardBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    checklists: PyList[Checklist] = []

    model_config = ConfigDict(from_attributes=True)


class WebSocketEventType(str, Enum):
    COMMENT = "comment"
    ACTIVITY = "activity"

class WebSocketAction(str, Enum):
    CREATED = "created"
    UPDATED = "updated"
    DELETED = "deleted"

class WebSocketEventBase(BaseModel):
    card_id: int
    event_type: WebSocketEventType
    action: WebSocketAction
    payload: Dict[str, Any]

class WebSocketEventCreate(WebSocketEventBase):
    user_id: int

class WebSocketEvent(WebSocketEventBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)