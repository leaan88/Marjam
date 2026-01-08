import httpx
import asyncio
import os
from typing import Optional, Dict, Any, List
import logging

logger = logging.getLogger(__name__)

class SunoService:
    """Suno API - Best for complete songs with vocals"""
    
    def __init__(self):
        self.api_key = os.getenv("SUNO_API_KEY")
        self.base_url = "https://apibox.erweima.ai"  # Common Suno API proxy
    
    async def generate_music(
        self,
        prompt: str,
        title: Optional[str] = None,
        style: Optional[str] = None,
        instrumental: bool = True,
        model: str = "V4_5",
        duration: int = 30
    ) -> Dict[str, Any]:
        """Generate music using Suno API"""
        
        if not self.api_key:
            return {"success": False, "error": "Suno API key not configured"}
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # Build payload
        payload = {
            "prompt": prompt,
            "make_instrumental": instrumental,
            "model": model,
            "wait_audio": True  # Wait for completion
        }
        
        if title:
            payload["title"] = title
        if style:
            payload["tags"] = style
        
        try:
            async with httpx.AsyncClient(timeout=180.0) as client:
                # Start generation
                response = await client.post(
                    f"{self.base_url}/api/suno/v1/music",
                    json=payload,
                    headers=headers
                )
                
                if response.status_code == 200:
                    data = response.json()
                    
                    if data.get("code") == 200 or data.get("data"):
                        songs = data.get("data", [])
                        if songs and len(songs) > 0:
                            song = songs[0]
                            return {
                                "success": True,
                                "audio_url": song.get("audio_url"),
                                "image_url": song.get("image_url"),
                                "title": song.get("title"),
                                "provider": "suno",
                                "duration": song.get("duration", duration),
                                "task_id": song.get("id")
                            }
                    
                    return {"success": False, "error": data.get("msg", "Unknown error")}
                else:
                    error_text = response.text
                    logger.error(f"Suno API error: {response.status_code} - {error_text}")
                    return {"success": False, "error": f"API error: {response.status_code}"}
                    
        except httpx.TimeoutException:
            logger.error("Suno API timeout")
            return {"success": False, "error": "Generation timeout - try again"}
        except Exception as e:
            logger.error(f"Suno error: {e}")
            return {"success": False, "error": str(e)}
    
    async def check_status(self, task_id: str) -> Dict[str, Any]:
        """Check generation status"""
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/api/suno/v1/music/{task_id}",
                    headers=headers
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return {"success": True, "data": data}
                else:
                    return {"success": False, "error": "Failed to check status"}
                    
        except Exception as e:
            return {"success": False, "error": str(e)}

suno_service = SunoService()
