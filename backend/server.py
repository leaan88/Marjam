from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

# Load environment before importing services
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Import music generation services
from services.music_generator import music_generator

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Marjam API", description="AI Music Loop Generation")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Music Generation Models
class LoopGenerateRequest(BaseModel):
    prompt: str
    mood: str = "groovy"
    bpm: int = 120
    duration: int = 8  # seconds (8, 16, 32 for different bar lengths)
    provider: str = "replicate"  # replicate, stable_audio, suno
    loop_type: str = "full"  # full, drums, bass, synth, lead, fx

class StemsGenerateRequest(BaseModel):
    prompt: str
    mood: str = "groovy"
    bpm: int = 120
    duration: int = 8
    stems: Optional[List[str]] = None  # ["drums", "bass", "synth", "lead"]

class GenerationResponse(BaseModel):
    success: bool
    generation_id: Optional[str] = None
    audio_url: Optional[str] = None
    provider: Optional[str] = None
    duration: Optional[int] = None
    error: Optional[str] = None
    prompt: Optional[str] = None
    mood: Optional[str] = None
    bpm: Optional[int] = None
    loop_type: Optional[str] = None

class Generation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = "anonymous"
    prompt: str
    mood: str
    bpm: int
    duration: int
    provider: str
    loop_type: str
    status: str = "pending"  # pending, generating, completed, failed
    audio_url: Optional[str] = None
    error: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Marjam API - AI Music Loop Generation"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# ============ MUSIC GENERATION ENDPOINTS ============

@api_router.get("/music/providers")
async def get_providers():
    """Get available AI music providers and their capabilities"""
    return {
        "providers": music_generator.get_available_providers()
    }

@api_router.post("/music/generate", response_model=GenerationResponse)
async def generate_loop(request: LoopGenerateRequest):
    """
    Generate a music loop using AI
    
    - **prompt**: Description of the sound you want
    - **mood**: Mood parameter (peaceful, groovy, darker, etc.)
    - **bpm**: Beats per minute (40-200)
    - **duration**: Duration in seconds (8, 16, 32 for bar lengths)
    - **provider**: AI provider (replicate, stable_audio, suno)
    - **loop_type**: Type of loop (full, drums, bass, synth, lead, fx)
    """
    
    try:
        result = await music_generator.generate_loop(
            prompt=request.prompt,
            mood=request.mood,
            bpm=request.bpm,
            duration=request.duration,
            provider=request.provider,
            loop_type=request.loop_type
        )
        
        # Save to database
        if result.get("success"):
            generation = Generation(
                prompt=request.prompt,
                mood=request.mood,
                bpm=request.bpm,
                duration=request.duration,
                provider=request.provider,
                loop_type=request.loop_type,
                status="completed",
                audio_url=result.get("audio_url")
            )
            
            doc = generation.model_dump()
            doc['created_at'] = doc['created_at'].isoformat()
            await db.generations.insert_one(doc)
            
            result["generation_id"] = generation.id
        
        return GenerationResponse(**result)
        
    except Exception as e:
        logger.error(f"Generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/music/generate-stems")
async def generate_stems(request: StemsGenerateRequest):
    """
    Generate multiple stems/instruments in parallel
    
    - **prompt**: Description of the overall sound
    - **mood**: Mood parameter
    - **bpm**: Beats per minute
    - **duration**: Duration per stem
    - **stems**: List of stems to generate ["drums", "bass", "synth", "lead"]
    """
    
    try:
        result = await music_generator.generate_stems(
            prompt=request.prompt,
            mood=request.mood,
            bpm=request.bpm,
            duration=request.duration,
            stems=request.stems
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Stems generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/music/generations")
async def get_generations(limit: int = 20):
    """Get recent music generations"""
    
    generations = await db.generations.find(
        {}, 
        {"_id": 0}
    ).sort("created_at", -1).to_list(limit)
    
    return {"generations": generations}

@api_router.get("/music/generation/{generation_id}")
async def get_generation(generation_id: str):
    """Get a specific generation by ID"""
    
    generation = await db.generations.find_one(
        {"id": generation_id},
        {"_id": 0}
    )
    
    if not generation:
        raise HTTPException(status_code=404, detail="Generation not found")
    
    return generation

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()