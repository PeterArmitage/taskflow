# app/websocket.py
import asyncio
from fastapi import WebSocket, WebSocketDisconnect, Depends
from typing import Dict, List, Optional

from .config import SECRET_KEY, ALGORITHM
from . import models, auth
from sqlalchemy.orm import Session
from .database import get_db
import json
import time
from jose import JWTError, jwt

class ConnectionManager:
    def __init__(self):
        # Store connections by card_id for targeted broadcasting
        self.card_connections: Dict[int, List[WebSocket]] = {}
        # Store user_id with each connection for authentication
        self.socket_users: Dict[WebSocket, int] = {}

    async def connect(self, websocket: WebSocket, card_id: int, user_id: int):
        await websocket.accept()
        if card_id not in self.card_connections:
            self.card_connections[card_id] = []
        self.card_connections[card_id].append(websocket)
        self.socket_users[websocket] = user_id
        print(f"Client connected to card {card_id}. Active connections: {len(self.card_connections[card_id])}")

    def disconnect(self, websocket: WebSocket, card_id: int):
        if card_id in self.card_connections:
            self.card_connections[card_id].remove(websocket)
            if not self.card_connections[card_id]:
                del self.card_connections[card_id]
        if websocket in self.socket_users:
            del self.socket_users[websocket]

    async def broadcast_to_card(self, card_id: int, message: dict, exclude: Optional[WebSocket] = None):
        if card_id in self.card_connections:
            for connection in self.card_connections[card_id]:
                if connection != exclude:
                    try:
                        await connection.send_json(message)
                    except:
                        await self.disconnect(connection, card_id)

# Create global connection manager
manager = ConnectionManager()

# Verify WebSocket token
async def get_user_from_token(token: str, db: Session) -> Optional[models.User]:
    try:
        # Remove 'Bearer ' prefix if present
        token = token.replace('Bearer ', '')
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        
        user = db.query(models.User).filter(models.User.username == username).first()
        return user
    except JWTError:
        return None
MESSAGE_RATE_LIMIT = 0.1  # Minimum time between messages in seconds

async def handle_websocket(websocket: WebSocket, card_id: int, token: str, db: Session):
    try:
        await websocket.accept()
        last_message_time = 0
        
        while True:
            current_time = time.time()
            if current_time - last_message_time < MESSAGE_RATE_LIMIT:
                await asyncio.sleep(MESSAGE_RATE_LIMIT - (current_time - last_message_time))
            
            data = await websocket.receive_json()
            last_message_time = time.time()
            
            # Validate message format
            if not all(key in data for key in ['type', 'action', 'data']):
                continue
                
            # Add user info to message
            user = await get_user_from_token(token, db)
            if not user:
                await websocket.close(code=4001)
                return
            
            data['user_id'] = user.id
            
            # Broadcast to all other clients subscribed to this card
            await manager.broadcast_to_card(card_id, data, exclude=websocket)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, card_id)
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.close(code=1011)  # Internal error
        manager.disconnect(websocket, card_id)