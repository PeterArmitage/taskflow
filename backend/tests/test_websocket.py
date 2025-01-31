# tests/test_websocket.py
import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient
import asyncio
from sqlalchemy.orm import Session
from app.main import app
from app import models, auth

async def test_websocket_connection():
    # Create test user and card
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Create token for authentication
        response = await ac.post("/token", data={
            "username": "testuser",
            "password": "testpassword"
        })
        token = response.json()["access_token"]

        # Connect to WebSocket with authentication
        async with ac.websocket_connect(
            f"/ws/cards/1?token={token}"
        ) as websocket:
            # Test sending a comment
            await websocket.send_json({
                "type": "comment",
                "action": "created",
                "cardId": 1,
                "data": {
                    "content": "Test comment"
                }
            })

            # Receive response
            data = await websocket.receive_json()
            assert data["type"] == "comment"
            assert data["action"] == "created"