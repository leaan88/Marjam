// API Service for Marjam
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Types
export interface LoopGenerateRequest {
  prompt: string;
  mood: string;
  bpm: number;
  duration: number;
  provider: string;
  loop_type: string;
}

export interface StemsGenerateRequest {
  prompt: string;
  mood: string;
  bpm: number;
  duration: number;
  stems?: string[];
}

export interface GenerationResponse {
  success: boolean;
  generation_id?: string;
  audio_url?: string;
  provider?: string;
  duration?: number;
  error?: string;
  prompt?: string;
  mood?: string;
  bpm?: number;
  loop_type?: string;
}

export interface Provider {
  id: string;
  name: string;
  description: string;
  available: boolean;
  max_duration: number;
  supports_stems: boolean;
}

// API Functions
export const musicApi = {
  // Get available AI providers
  async getProviders(): Promise<{ providers: Provider[] }> {
    const response = await fetch(`${API}/music/providers`);
    if (!response.ok) throw new Error('Failed to fetch providers');
    return response.json();
  },

  // Generate a single loop
  async generateLoop(request: LoopGenerateRequest): Promise<GenerationResponse> {
    const response = await fetch(`${API}/music/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Generation failed');
    }
    return response.json();
  },

  // Generate multiple stems
  async generateStems(request: StemsGenerateRequest): Promise<any> {
    const response = await fetch(`${API}/music/generate-stems`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Stems generation failed');
    }
    return response.json();
  },

  // Get generation history
  async getGenerations(limit = 20): Promise<{ generations: any[] }> {
    const response = await fetch(`${API}/music/generations?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch generations');
    return response.json();
  },

  // Get single generation
  async getGeneration(id: string): Promise<any> {
    const response = await fetch(`${API}/music/generation/${id}`);
    if (!response.ok) throw new Error('Generation not found');
    return response.json();
  }
};

export default musicApi;
