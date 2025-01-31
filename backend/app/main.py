# main.py
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Depends, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, get_db
from . import models
from .routes import router
from .exceptions import (
    NotFoundException, 
    ForbiddenException, 
    BadRequestException, 
    CustomException, 
    UnauthorizedException
)
import logging
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter
import redis.asyncio as redis
from redis.exceptions import ConnectionError as RedisConnectionError
from dotenv import load_dotenv
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from typing import List, Dict
from .config import SECRET_KEY, ALGORITHM

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
models.Base.metadata.create_all(bind=engine)

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}
        self.socket_users: Dict[WebSocket, int] = {}

    async def connect(self, websocket: WebSocket, card_id: int, user_id: int):
        await websocket.accept()
        if card_id not in self.active_connections:
            self.active_connections[card_id] = []
        self.active_connections[card_id].append(websocket)
        self.socket_users[websocket] = user_id

    async def disconnect(self, websocket: WebSocket, card_id: int):
        if card_id in self.active_connections:
            self.active_connections[card_id].remove(websocket)

    async def broadcast(self, message: dict, card_id: int):
        if card_id in self.active_connections:
            for connection in self.active_connections[card_id]:
                await connection.send_json(message)

manager = ConnectionManager()



@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
    try:
        r = await redis.from_url(redis_url, encoding="utf-8", decode_responses=True)
        await r.ping()  # Test the connection
        await FastAPILimiter.init(r)
        app.state.use_redis = True
        logger.info("Connected to Redis successfully")
    except (RedisConnectionError, OSError):
        logger.warning("Failed to connect to Redis. Rate limiting is disabled.")
        app.state.use_redis = False
    
    yield
    
    if app.state.use_redis:
        await FastAPILimiter.close()

app = FastAPI(lifespan=lifespan)

# Add CORS middleware right after creating the app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)



# Exception handlers
@app.exception_handler(NotFoundException)
async def not_found_exception_handler(request: Request, exc: NotFoundException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )

@app.exception_handler(ForbiddenException)
async def forbidden_exception_handler(request: Request, exc: ForbiddenException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )

@app.exception_handler(BadRequestException)
async def bad_request_exception_handler(request: Request, exc: BadRequestException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )

@app.exception_handler(CustomException)
async def custom_exception_handler(request: Request, exc: CustomException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )
    
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response: {response.status_code}")
    return response

async def rate_limit_if_redis():
    if app.state.use_redis:
        await RateLimiter(times=2, seconds=5)

@app.get("/", dependencies=[Depends(rate_limit_if_redis)])
async def root():
    return {"message": "Hello World"}