import replicate
import os
import asyncio
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

class ReplicateMusicService:
    """MusicGen via Replicate - Best for stems, loops, BPM control"""
    
    def __init__(self):
        self.api_token = os.getenv("REPLICATE_API_TOKEN")
        if self.api_token:
            os.environ["REPLICATE_API_TOKEN"] = self.api_token
    
    async def generate_music(
        self,
        prompt: str,
        duration: int = 8,
        model_version: str = "melody",
        temperature: float = 1.0,
        top_k: int = 250,
        top_p: float = 0.0,
        cfg_coef: float = 3.0
    ) -> Dict[str, Any]:
        """Generate music using MusicGen on Replicate"""
        
        if not self.api_token:
            return {"success": False, "error": "Replicate API token not configured"}
        
        try:
            # Use the current meta/musicgen model (Replicate handles versioning automatically)
            model = "meta/musicgen"
            
            input_params = {
                "prompt": prompt,
                "duration": min(duration, 30),  # Max 30 seconds
                "temperature": temperature,
                "top_k": top_k,
                "top_p": top_p,
                "classifier_free_guidance": cfg_coef,
                "output_format": "wav",
                "normalization_strategy": "peak"
            }
            
            # Run generation
            output = replicate.run(model, input=input_params)
            
            # Output is the audio URL
            if output:
                return {
                    "success": True,
                    "audio_url": output,
                    "provider": "replicate",
                    "model": model_version,
                    "duration": duration
                }
            else:
                return {"success": False, "error": "No output from Replicate"}
                
        except Exception as e:
            logger.error(f"Replicate generation error: {e}")
            return {"success": False, "error": str(e)}
    
    async def generate_stem(
        self,
        prompt: str,
        stem_type: str,  # drums, bass, synth, vocals
        duration: int = 8,
        bpm: int = 120
    ) -> Dict[str, Any]:
        """Generate a specific stem/instrument"""
        
        # Enhance prompt with stem-specific instructions
        stem_prompts = {
            "drums": f"{bpm} BPM drum loop, {prompt}, no melody, percussion only, tight groove",
            "bass": f"{bpm} BPM bass line, {prompt}, deep sub bass, no drums, rhythmic",
            "synth": f"{bpm} BPM synth pad, {prompt}, atmospheric, no drums no bass",
            "lead": f"{bpm} BPM lead melody, {prompt}, catchy hook, no drums",
            "fx": f"sound effects, risers, impacts, transitions, {prompt}"
        }
        
        enhanced_prompt = stem_prompts.get(stem_type, f"{bpm} BPM {stem_type}, {prompt}")
        
        return await self.generate_music(
            prompt=enhanced_prompt,
            duration=duration,
            temperature=0.9,
            cfg_coef=4.0
        )

replicate_service = ReplicateMusicService()
