import os
import jwt
import bcrypt
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr
import logging

logger = logging.getLogger(__name__)

# JWT Secret
JWT_SECRET = os.getenv("JWT_SECRET", "marjam-super-secret-key-2025")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24 * 7  # 7 days

# User Tiers
class UserTier:
    FREE = "free"
    PREMIUM = "premium"
    ADMIN = "admin"

# Tier Limits - Scaled Features (Admin > Premium > Free)
TIER_LIMITS = {
    UserTier.FREE: {
        "max_uploads": 3,
        "max_generations": 2,
        "can_download": False,
        "can_use_core_samples": True,  # Can listen only
        "can_create_songs": False,
        "locked_moods": ["introspective", "uplift", "darker", "lighter", "banging", "dry", "wet", "minimal", "complex", "hypnotic", "energetic", "aggressive", "dreamy"],
        "available_moods": ["peaceful", "focus", "groovy", "chill"],
        "max_duration": 8,
        "max_bars": 8,
        "ai_providers": [],  # No AI access
        "features": ["listen_core", "listen_samples", "basic_player"]
    },
    UserTier.PREMIUM: {
        "max_uploads": 50,
        "max_generations": 30,
        "can_download": True,
        "can_use_core_samples": True,
        "can_create_songs": True,
        "locked_moods": ["aggressive", "dreamy"],  # Only 2 locked
        "available_moods": ["peaceful", "focus", "groovy", "chill", "introspective", "uplift", "darker", "lighter", "banging", "dry", "wet", "minimal", "complex", "hypnotic", "energetic"],
        "max_duration": 32,
        "max_bars": 32,
        "ai_providers": ["replicate"],  # Limited AI
        "features": ["listen_core", "listen_samples", "download", "create_songs", "ai_generate", "advanced_player", "export_wav"]
    },
    UserTier.ADMIN: {
        "max_uploads": -1,  # Unlimited
        "max_generations": -1,  # Unlimited
        "can_download": True,
        "can_use_core_samples": True,
        "can_create_songs": True,
        "can_upload_core": True,  # Only admin
        "can_manage_users": True,  # Only admin
        "locked_moods": [],  # All unlocked
        "available_moods": ["peaceful", "focus", "groovy", "chill", "introspective", "uplift", "darker", "lighter", "banging", "dry", "wet", "minimal", "complex", "hypnotic", "energetic", "aggressive", "dreamy"],
        "max_duration": 60,
        "max_bars": 64,
        "ai_providers": ["replicate", "stable_audio", "suno"],  # All AI providers
        "features": ["listen_core", "listen_samples", "download", "create_songs", "ai_generate", "advanced_player", "export_wav", "export_stems", "upload_core", "manage_users", "analytics"]
    }
}

class AuthService:
    def __init__(self, db):
        self.db = db
    
    def hash_password(self, password: str) -> str:
        """Hash a password using bcrypt"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode(), salt).decode()
    
    def verify_password(self, password: str, hashed: str) -> bool:
        """Verify a password against its hash"""
        return bcrypt.checkpw(password.encode(), hashed.encode())
    
    def create_token(self, user_id: str, email: str, tier: str) -> str:
        """Create a JWT token"""
        payload = {
            "user_id": user_id,
            "email": email,
            "tier": tier,
            "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS),
            "iat": datetime.now(timezone.utc)
        }
        return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify and decode a JWT token"""
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            logger.warning("Token expired")
            return None
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid token: {e}")
            return None
    
    async def create_user(
        self,
        email: str,
        password: str,
        name: str,
        tier: str = UserTier.FREE
    ) -> Dict[str, Any]:
        """Create a new user"""
        import uuid
        
        # Check if user exists
        existing = await self.db.users.find_one({"email": email})
        if existing:
            return {"success": False, "error": "Email already registered"}
        
        user_id = str(uuid.uuid4())
        user = {
            "id": user_id,
            "email": email,
            "password": self.hash_password(password),
            "name": name,
            "tier": tier,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "uploads_count": 0,
            "generations_count": 0
        }
        
        await self.db.users.insert_one(user)
        
        # Create token
        token = self.create_token(user_id, email, tier)
        
        return {
            "success": True,
            "user": {
                "id": user_id,
                "email": email,
                "name": name,
                "tier": tier
            },
            "token": token
        }
    
    async def login(self, email: str, password: str) -> Dict[str, Any]:
        """Authenticate a user"""
        user = await self.db.users.find_one({"email": email})
        
        if not user:
            return {"success": False, "error": "Invalid email or password"}
        
        if not self.verify_password(password, user["password"]):
            return {"success": False, "error": "Invalid email or password"}
        
        # Create token
        token = self.create_token(user["id"], email, user["tier"])
        
        return {
            "success": True,
            "user": {
                "id": user["id"],
                "email": user["email"],
                "name": user["name"],
                "tier": user["tier"]
            },
            "token": token,
            "limits": TIER_LIMITS.get(user["tier"], TIER_LIMITS[UserTier.FREE])
        }
    
    async def get_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        user = await self.db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
        if user:
            user["limits"] = TIER_LIMITS.get(user["tier"], TIER_LIMITS[UserTier.FREE])
        return user
    
    async def update_tier(self, user_id: str, new_tier: str) -> Dict[str, Any]:
        """Update user tier (admin only)"""
        result = await self.db.users.update_one(
            {"id": user_id},
            {"$set": {"tier": new_tier}}
        )
        
        if result.modified_count > 0:
            return {"success": True, "message": f"User upgraded to {new_tier}"}
        return {"success": False, "error": "User not found"}
    
    async def get_all_users(self) -> list:
        """Get all users (admin only)"""
        users = await self.db.users.find({}, {"_id": 0, "password": 0}).to_list(1000)
        return users
    
    async def seed_test_users(self):
        """Create test users for each tier"""
        test_users = [
            {
                "email": "admin@marjam.io",
                "password": "Admin123!",
                "name": "Admin User",
                "tier": UserTier.ADMIN
            },
            {
                "email": "premium@marjam.io",
                "password": "Premium123!",
                "name": "Premium User",
                "tier": UserTier.PREMIUM
            },
            {
                "email": "free@marjam.io",
                "password": "Free123!",
                "name": "Free User",
                "tier": UserTier.FREE
            }
        ]
        
        created = []
        for user_data in test_users:
            # Check if already exists
            existing = await self.db.users.find_one({"email": user_data["email"]})
            if not existing:
                result = await self.create_user(
                    email=user_data["email"],
                    password=user_data["password"],
                    name=user_data["name"],
                    tier=user_data["tier"]
                )
                if result["success"]:
                    created.append({
                        "email": user_data["email"],
                        "password": user_data["password"],
                        "tier": user_data["tier"]
                    })
        
        return created
