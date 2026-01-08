import asyncio
import os
from typing import Optional, Dict, Any, List
import logging
from datetime import datetime
import uuid

from .replicate_service import replicate_service
from .stable_audio_service import stable_audio_service
from .suno_service import suno_service

logger = logging.getLogger(__name__)

class MusicGenerator:
    """
    Unified Music Generation Service
    Combines Replicate (MusicGen), Stable Audio, and Suno
    """
    
    def __init__(self):
        self.providers = {
            "replicate": replicate_service,
            "stable_audio": stable_audio_service,
            "suno": suno_service
        }
    
    async def generate_loop(
        self,
        prompt: str,
        mood: str = "groovy",
        bpm: int = 120,
        duration: int = 8,
        provider: str = "replicate",
        loop_type: str = "full"  # full, drums, bass, synth, lead, fx
    ) -> Dict[str, Any]:
        """
        Generate a music loop with specified parameters
        
        Args:
            prompt: Description of the sound
            mood: Mood parameter (peaceful, groovy, darker, etc.)
            bpm: Beats per minute
            duration: Duration in seconds (8, 16, 32 bars)
            provider: Which AI provider to use
            loop_type: Type of loop to generate
        """
        
        # Build enhanced prompt with mood and BPM
        enhanced_prompt = self._build_prompt(prompt, mood, bpm, loop_type)
        
        logger.info(f"Generating {loop_type} loop: {enhanced_prompt[:100]}...")
        
        try:
            if provider == "replicate":
                if loop_type != "full":
                    result = await replicate_service.generate_stem(
                        prompt=prompt,
                        stem_type=loop_type,
                        duration=duration,
                        bpm=bpm
                    )
                else:
                    result = await replicate_service.generate_music(
                        prompt=enhanced_prompt,
                        duration=duration
                    )
                    
            elif provider == "stable_audio":
                result = await stable_audio_service.generate_music(
                    prompt=enhanced_prompt,
                    duration=float(duration)
                )
                
            elif provider == "suno":
                result = await suno_service.generate_music(
                    prompt=enhanced_prompt,
                    style=f"{mood}, {bpm} BPM",
                    instrumental=True,
                    duration=duration
                )
            else:
                return {"success": False, "error": f"Unknown provider: {provider}"}
            
            if result.get("success"):
                result["generation_id"] = str(uuid.uuid4())
                result["prompt"] = prompt
                result["mood"] = mood
                result["bpm"] = bpm
                result["loop_type"] = loop_type
                result["created_at"] = datetime.utcnow().isoformat()
            
            return result
            
        except Exception as e:
            logger.error(f"Generation error: {e}")
            return {"success": False, "error": str(e)}
    
    async def generate_stems(
        self,
        prompt: str,
        mood: str = "groovy",
        bpm: int = 120,
        duration: int = 8,
        stems: List[str] = None
    ) -> Dict[str, Any]:
        """
        Generate multiple stems in parallel
        """
        
        if stems is None:
            stems = ["drums", "bass", "synth", "lead"]
        
        # Generate all stems in parallel
        tasks = [
            self.generate_loop(
                prompt=prompt,
                mood=mood,
                bpm=bpm,
                duration=duration,
                provider="replicate",
                loop_type=stem
            )
            for stem in stems
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        stem_results = {}
        for stem, result in zip(stems, results):
            if isinstance(result, Exception):
                stem_results[stem] = {"success": False, "error": str(result)}
            else:
                stem_results[stem] = result
        
        return {
            "success": True,
            "stems": stem_results,
            "prompt": prompt,
            "mood": mood,
            "bpm": bpm,
            "duration": duration
        }
    
    def _build_prompt(
        self,
        base_prompt: str,
        mood: str,
        bpm: int,
        loop_type: str
    ) -> str:
        """
        Build an enhanced prompt with mood and parameters
        """
        
        mood_descriptors = {
            "peaceful": "calm, serene, ambient, relaxing",
            "focus": "minimal, clean, concentration, steady",
            "groovy": "funky, rhythmic, danceable, bouncy",
            "introspective": "emotional, deep, thoughtful, melancholic",
            "uplift": "uplifting, positive, energetic, happy",
            "darker": "dark, moody, mysterious, intense",
            "lighter": "bright, airy, light, cheerful",
            "banging": "hard-hitting, powerful, intense, driving",
            "dry": "minimal reverb, tight, punchy, clean",
            "wet": "reverb, spacious, atmospheric, lush",
            "minimal": "simple, sparse, essential, stripped back",
            "complex": "intricate, layered, detailed, rich",
            "hypnotic": "repetitive, trance-like, mesmerizing, looping",
            "energetic": "high energy, dynamic, exciting, powerful",
            "chill": "relaxed, laid-back, smooth, easy",
            "aggressive": "intense, hard, aggressive, raw",
            "dreamy": "ethereal, dreamy, floating, surreal"
        }
        
        mood_desc = mood_descriptors.get(mood.lower(), mood)
        
        # Build prompt
        prompt_parts = [
            f"{bpm} BPM",
            mood_desc,
            base_prompt,
            "high quality",
            "professional production",
            "seamless loop" if loop_type != "fx" else ""
        ]
        
        return ", ".join(filter(None, prompt_parts))
    
    def get_available_providers(self) -> List[Dict[str, Any]]:
        """Return list of available providers with their status"""
        
        return [
            {
                "id": "replicate",
                "name": "MusicGen (Replicate)",
                "description": "Best for stems, loops, BPM control",
                "available": bool(os.getenv("REPLICATE_API_TOKEN")),
                "max_duration": 30,
                "supports_stems": True
            },
            {
                "id": "stable_audio", 
                "name": "Stable Audio",
                "description": "High quality full tracks",
                "available": bool(os.getenv("STABLE_AUDIO_API_KEY")),
                "max_duration": 47,
                "supports_stems": False
            },
            {
                "id": "suno",
                "name": "Suno AI",
                "description": "Complete songs with best quality",
                "available": bool(os.getenv("SUNO_API_KEY")),
                "max_duration": 240,
                "supports_stems": False
            }
        ]

music_generator = MusicGenerator()
