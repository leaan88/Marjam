#!/usr/bin/env python3
"""
Backend API Testing for Marjam AI Music Generation API
Tests all endpoints as specified in the review request
"""

import requests
import json
import time
import os
from typing import Dict, Any

# Get backend URL from frontend .env
BACKEND_URL = "https://sleep-sounds-4.preview.emergentagent.com/api"

class MarjamAPITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        
    def test_welcome_endpoint(self) -> Dict[str, Any]:
        """Test GET /api/ - Should return welcome message"""
        print("\n=== Testing Welcome Endpoint ===")
        
        try:
            response = self.session.get(f"{self.base_url}/")
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "Marjam" in data["message"]:
                    return {"success": True, "message": "Welcome endpoint working correctly"}
                else:
                    return {"success": False, "error": f"Unexpected response format: {data}"}
            else:
                return {"success": False, "error": f"HTTP {response.status_code}: {response.text}"}
                
        except Exception as e:
            return {"success": False, "error": f"Request failed: {str(e)}"}
    
    def test_providers_endpoint(self) -> Dict[str, Any]:
        """Test GET /api/music/providers - Should return list of available AI providers"""
        print("\n=== Testing Providers Endpoint ===")
        
        try:
            response = self.session.get(f"{self.base_url}/music/providers")
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                
                # Check if providers key exists
                if "providers" not in data:
                    return {"success": False, "error": "Missing 'providers' key in response"}
                
                providers = data["providers"]
                
                # Check if we have the expected providers
                expected_providers = ["replicate", "stable_audio", "suno"]
                provider_ids = [p.get("id") for p in providers]
                
                missing_providers = [p for p in expected_providers if p not in provider_ids]
                if missing_providers:
                    return {"success": False, "error": f"Missing providers: {missing_providers}"}
                
                # Check provider structure
                for provider in providers:
                    required_fields = ["id", "name", "description", "available", "max_duration", "supports_stems"]
                    missing_fields = [field for field in required_fields if field not in provider]
                    if missing_fields:
                        return {"success": False, "error": f"Provider {provider.get('id')} missing fields: {missing_fields}"}
                
                return {"success": True, "message": f"Found {len(providers)} providers with correct structure", "providers": providers}
            else:
                return {"success": False, "error": f"HTTP {response.status_code}: {response.text}"}
                
        except Exception as e:
            return {"success": False, "error": f"Request failed: {str(e)}"}
    
    def test_generate_endpoint(self) -> Dict[str, Any]:
        """Test POST /api/music/generate - Test music generation"""
        print("\n=== Testing Music Generation Endpoint ===")
        
        # Test payload as specified in review request
        test_payload = {
            "prompt": "deep house kick drum loop",
            "mood": "groovy",
            "bpm": 120,
            "duration": 8,
            "provider": "replicate",
            "loop_type": "drums"
        }
        
        try:
            print(f"Sending payload: {json.dumps(test_payload, indent=2)}")
            response = self.session.post(
                f"{self.base_url}/music/generate",
                json=test_payload
            )
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                
                # Check required response fields
                required_fields = ["success", "generation_id", "audio_url", "provider", "duration"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    return {"success": False, "error": f"Missing response fields: {missing_fields}"}
                
                if not data.get("success"):
                    return {"success": False, "error": f"Generation failed: {data.get('error', 'Unknown error')}"}
                
                return {
                    "success": True, 
                    "message": "Generation endpoint accepts requests correctly",
                    "generation_id": data.get("generation_id"),
                    "provider": data.get("provider"),
                    "duration": data.get("duration")
                }
            else:
                return {"success": False, "error": f"HTTP {response.status_code}: {response.text}"}
                
        except Exception as e:
            return {"success": False, "error": f"Request failed: {str(e)}"}
    
    def test_generations_list_endpoint(self) -> Dict[str, Any]:
        """Test GET /api/music/generations - Should return list of recent generations"""
        print("\n=== Testing Generations List Endpoint ===")
        
        try:
            response = self.session.get(f"{self.base_url}/music/generations")
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                
                # Check if generations key exists
                if "generations" not in data:
                    return {"success": False, "error": "Missing 'generations' key in response"}
                
                generations = data["generations"]
                
                # Should be a list
                if not isinstance(generations, list):
                    return {"success": False, "error": "Generations should be a list"}
                
                return {
                    "success": True, 
                    "message": f"Generations endpoint working, found {len(generations)} generations",
                    "count": len(generations)
                }
            else:
                return {"success": False, "error": f"HTTP {response.status_code}: {response.text}"}
                
        except Exception as e:
            return {"success": False, "error": f"Request failed: {str(e)}"}
    
    def run_all_tests(self) -> Dict[str, Any]:
        """Run all API tests and return comprehensive results"""
        print(f"Testing Marjam API at: {self.base_url}")
        print("=" * 60)
        
        results = {}
        
        # Test 1: Welcome endpoint
        results["welcome"] = self.test_welcome_endpoint()
        
        # Test 2: Providers endpoint
        results["providers"] = self.test_providers_endpoint()
        
        # Test 3: Generation endpoint
        results["generate"] = self.test_generate_endpoint()
        
        # Test 4: Generations list endpoint
        results["generations_list"] = self.test_generations_list_endpoint()
        
        # Summary
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(results)
        passed_tests = sum(1 for result in results.values() if result.get("success"))
        
        for test_name, result in results.items():
            status = "✅ PASS" if result.get("success") else "❌ FAIL"
            print(f"{test_name.upper()}: {status}")
            if not result.get("success"):
                print(f"  Error: {result.get('error')}")
            elif result.get("message"):
                print(f"  {result.get('message')}")
        
        print(f"\nOverall: {passed_tests}/{total_tests} tests passed")
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "success_rate": passed_tests / total_tests if total_tests > 0 else 0,
            "results": results
        }

def main():
    """Main test execution"""
    tester = MarjamAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    results = main()
    
    # Exit with appropriate code
    if results["success_rate"] == 1.0:
        print("\n🎉 All tests passed!")
        exit(0)
    else:
        print(f"\n⚠️  {results['total_tests'] - results['passed_tests']} test(s) failed")
        exit(1)