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
        
        # Correct model ID with version hash
        self.model_id = "meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb"
    
    async def generate_music(
        self,
        prompt: str,
        duration: int = 8,
        model_version: str = "stereo-large",
        temperature: float = 1.0,
        top_k: int = 250,
        top_p: float = 0.0,
        cfg_coef: int = 3
    ) -> Dict[str, Any]:
        """Generate music using MusicGen on Replicate"""
        
        if not self.api_token:
            return {"success": False, "error": "Replicate API token not configured"}
        
        try:
            # Build input parameters matching the Replicate API schema
            input_params = {
                "prompt": prompt,
                "duration": min(duration, 30),  # Max 30 seconds
                "model_version": model_version,  # stereo-large, stereo-melody-large, melody-large, large
                "temperature": temperature,
                "top_k": top_k,
                "top_p": top_p,
                "classifier_free_guidance": cfg_coef,
                "output_format": "mp3",
                "normalization_strategy": "peak",
                "continuation": False,
                "multi_band_diffusion": False
            }
            
            logger.info(f"Generating music with MusicGen: {prompt[:50]}...")
            
            # Run generation using the correct model ID with version
            output = replicate.run(
                self.model_id,
                input=input_params
            )
            
            # Output is a FileOutput object - get the URL
            if output:
                # Handle FileOutput object
                if hasattr(output, 'url'):
                    audio_url = output.url
                elif isinstance(output, str):
                    audio_url = output
                else:
                    audio_url = str(output)
                
                logger.info(f"Generation successful: {audio_url[:100]}...")
                
                return {
                    "success": True,
                    "audio_url": audio_url,
                    "provider": "replicate",
                    "model": model_version,
                    "duration": duration
                }
            else:
                return {"success": False, "error": "No output from Replicate"}
                
        except Exception as e:
            error_msg = str(e)
            logger.error(f"Replicate generation error: {error_msg}")
            return {"success": False, "error": f"Replicate error: {error_msg}"}
    
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
            "drums": f"{bpm} BPM drum loop, {prompt}, percussion only, no melody, tight rhythmic groove",
            "bass": f"{bpm} BPM bass line, {prompt}, deep bass, no drums, rhythmic and groovy",
            "synth": f"{bpm} BPM synth pad, {prompt}, atmospheric, ambient, no drums no bass",
            "lead": f"{bpm} BPM lead melody, {prompt}, catchy melodic hook, no drums",
            "fx": f"sound effects, risers, impacts, transitions, cinematic, {prompt}"
        }
        
        enhanced_prompt = stem_prompts.get(stem_type, f"{bpm} BPM {stem_type}, {prompt}")
        
        return await self.generate_music(
            prompt=enhanced_prompt,
            duration=duration,
            model_version="stereo-large",
            temperature=0.9,
            cfg_coef=4
        )

replicate_service = ReplicateMusicService()
