# app/models.py
from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, DateTime, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
from enum import Enum as PyEnum

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    password_reset_token = Column(String, unique=True, nullable=True)
    password_reset_expires = Column(DateTime, nullable=True)
    boards = relationship("Board", back_populates="owner")
    activities = relationship("Activity", back_populates="user")
    templates = relationship("BoardTemplate", back_populates="creator")

class Board(Base):
    __tablename__ = "boards"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    owner = relationship("User", back_populates="boards")
    lists = relationship("List", back_populates="board", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="board")

class List(Base):
    __tablename__ = "lists"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    board_id = Column(Integer, ForeignKey("boards.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    board = relationship("Board", back_populates="lists")
    cards = relationship("Card", back_populates="list", cascade="all, delete-orphan")

class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    list_id = Column(Integer, ForeignKey("lists.id"))
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    list = relationship("List", back_populates="cards")
    labels = relationship("Label", back_populates="card")
    attachments = relationship("Attachment", back_populates="card")

class ActivityType(str, PyEnum):
    CARD_CREATED = "card_created"
    CARD_MOVED = "card_moved"
    CARD_ARCHIVED = "card_archived"
    LIST_CREATED = "list_created"
    
class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    board_id = Column(Integer, ForeignKey("boards.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    activity_type = Column(String)  
    details = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    board = relationship("Board", back_populates="activities")
    user = relationship("User", back_populates="activities")

class Label(Base):
    __tablename__ = "labels"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    color = Column(String)
    card_id = Column(Integer, ForeignKey("cards.id"))
    type = Column(String, nullable=True)
    card = relationship("Card", back_populates="labels")
    description = Column(String, nullable=True)

class Attachment(Base):
    __tablename__ = "attachments"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    file_path = Column(String)
    card_id = Column(Integer, ForeignKey("cards.id"))
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    card = relationship("Card", back_populates="attachments")

class BoardTemplate(Base):
    __tablename__ = "board_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    creator = relationship("User", back_populates="templates")
    lists = relationship("ListTemplate", back_populates="board_template")

class ListTemplate(Base):
    __tablename__ = "list_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    board_template_id = Column(Integer, ForeignKey("board_templates.id"))

    board_template = relationship("BoardTemplate", back_populates="lists")
    
class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
    card_id = Column(Integer, ForeignKey("cards.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    card = relationship("Card", back_populates="comments")
    user = relationship("User", back_populates="comments")

# Update Card and User models
Card.comments = relationship("Comment", back_populates="card")
User.comments = relationship("Comment", back_populates="user")    

class PermissionLevel(str, PyEnum):
    VIEW = "view"
    EDIT = "edit"
    ADMIN = "admin"

class BoardMember(Base):
    __tablename__ = "board_members"

    id = Column(Integer, primary_key=True, index=True)
    board_id = Column(Integer, ForeignKey("boards.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    permission_level = Column(Enum(PermissionLevel), nullable=False, default=PermissionLevel.VIEW)

    board = relationship("Board", back_populates="members")
    user = relationship("User", back_populates="board_memberships")

class Checklist(Base):
    __tablename__ = "checklists"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    card_id = Column(Integer, ForeignKey("cards.id"))
    position = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    card = relationship("Card", back_populates="checklists")
    items = relationship("ChecklistItem", back_populates="checklist", cascade="all, delete-orphan")

class ChecklistItem(Base):
    __tablename__ = "checklist_items"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
    completed = Column(Boolean, default=False)
    position = Column(Integer, default=0)
    checklist_id = Column(Integer, ForeignKey("checklists.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    checklist = relationship("Checklist", back_populates="items")

# Update the Card model to include the relationship
Card.checklists = relationship("Checklist", back_populates="card", cascade="all, delete-orphan")    

# Update Board and User models
Board.members = relationship("BoardMember", back_populates="board")
User.board_memberships = relationship("BoardMember", back_populates="user")

class WebSocketEvent(Base):
    __tablename__ = "websocket_events"

    id = Column(Integer, primary_key=True, index=True)
    card_id = Column(Integer, ForeignKey("cards.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    event_type = Column(String)  # 'comment' or 'activity'
    action = Column(String)  # 'created', 'updated', 'deleted'
    payload = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    card = relationship("Card", back_populates="websocket_events")
    user = relationship("User", back_populates="websocket_events")

# Update Card and User models to include the new relationship
Card.websocket_events = relationship("WebSocketEvent", back_populates="card")
User.websocket_events = relationship("WebSocketEvent", back_populates="user")