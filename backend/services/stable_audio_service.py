import httpx
import asyncio
import os
from typing import Optional, Dict, Any
import logging
import base64

logger = logging.getLogger(__name__)

class StableAudioService:
    """Stable Audio API - Best for high quality full tracks"""
    
    def __init__(self):
        self.api_key = os.getenv("STABLE_AUDIO_API_KEY")
        self.base_url = "https://api.stability.ai/v2beta/audio/generate"
    
    async def generate_music(
        self,
        prompt: str,
        duration: float = 30.0,
        steps: int = 100,
        cfg_scale: float = 7.0,
        seed: Optional[int] = None
    ) -> Dict[str, Any]:
        """Generate music using Stable Audio API"""
        
        if not self.api_key:
            return {"success": False, "error": "Stable Audio API key not configured"}
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "audio/*"
        }
        
        # Use form data as per Stability AI docs
        data = {
            "prompt": prompt,
            "output_format": "mp3",
            "duration": str(min(duration, 47)),  # Max ~47 seconds
            "steps": str(steps)
        }
        
        if seed is not None:
            data["seed"] = str(seed)
        
        try:
            async with httpx.AsyncClient(timeout=180.0) as client:
                response = await client.post(
                    self.base_url,
                    data=data,
                    headers=headers
                )
                
                logger.info(f"Stable Audio response status: {response.status_code}")
                
                if response.status_code == 200:
                    # Response is audio data directly
                    audio_data = response.content
                    # Convert to base64 data URL
                    audio_b64 = base64.b64encode(audio_data).decode('utf-8')
                    audio_url = f"data:audio/mpeg;base64,{audio_b64}"
                    
                    return {
                        "success": True,
                        "audio_url": audio_url,
                        "provider": "stable_audio",
                        "duration": duration
                    }
                else:
                    error_text = response.text
                    logger.error(f"Stable Audio API error: {response.status_code} - {error_text}")
                    return {"success": False, "error": f"API error: {response.status_code} - {error_text[:200]}"}
                    
        except httpx.TimeoutException:
            logger.error("Stable Audio API timeout")
            return {"success": False, "error": "Request timeout"}
        except Exception as e:
            logger.error(f"Stable Audio error: {e}")
            return {"success": False, "error": str(e)}

stable_audio_service = StableAudioService()
