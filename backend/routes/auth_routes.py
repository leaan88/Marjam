from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, EmailStr
from typing import Optional
import logging

logger = logging.getLogger(__name__)

auth_router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Will be set by main server
auth_service = None

def set_auth_service(service):
    global auth_service
    auth_service = service

# Request Models
class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UpdateTierRequest(BaseModel):
    user_id: str
    tier: str

# Auth dependency
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        return None
    
    try:
        # Extract token from "Bearer <token>"
        if authorization.startswith("Bearer "):
            token = authorization[7:]
        else:
            token = authorization
        
        payload = auth_service.verify_token(token)
        if payload:
            user = await auth_service.get_user(payload["user_id"])
            return user
    except Exception as e:
        logger.error(f"Auth error: {e}")
    
    return None

async def require_auth(authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    return user

async def require_admin(authorization: Optional[str] = Header(None)):
    user = await require_auth(authorization)
    if user["tier"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# Routes
@auth_router.post("/register")
async def register(request: RegisterRequest):
    """Register a new user (free tier by default)"""
    result = await auth_service.create_user(
        email=request.email,
        password=request.password,
        name=request.name
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result

@auth_router.post("/login")
async def login(request: LoginRequest):
    """Login and get JWT token"""
    result = await auth_service.login(
        email=request.email,
        password=request.password
    )
    
    if not result["success"]:
        raise HTTPException(status_code=401, detail=result["error"])
    
    return result

@auth_router.get("/me")
async def get_me(user = Depends(require_auth)):
    """Get current user info"""
    return {"user": user}

@auth_router.get("/users")
async def get_users(user = Depends(require_admin)):
    """Get all users (admin only)"""
    users = await auth_service.get_all_users()
    return {"users": users}

@auth_router.post("/users/update-tier")
async def update_tier(request: UpdateTierRequest, user = Depends(require_admin)):
    """Update user tier (admin only)"""
    result = await auth_service.update_tier(request.user_id, request.tier)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result

@auth_router.post("/seed-test-users")
async def seed_test_users():
    """Create test users for each tier (dev only)"""
    created = await auth_service.seed_test_users()
    return {
        "message": "Test users created",
        "users": created
    }
