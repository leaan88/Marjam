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

export interface Sample {
  id: string;
  name: string;
  filename: string;
  audio_url: string;
  bpm: number;
  loop_type: string;
  mood: string;
  key?: string;
  created_at: string;
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

// Samples API
export const samplesApi = {
  // Get all samples
  async getSamples(loopType?: string): Promise<{ samples: Sample[] }> {
    const url = loopType 
      ? `${API}/samples?loop_type=${loopType}` 
      : `${API}/samples`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch samples');
    return response.json();
  },

  // Get single sample
  async getSample(id: string): Promise<Sample> {
    const response = await fetch(`${API}/samples/${id}`);
    if (!response.ok) throw new Error('Sample not found');
    return response.json();
  },

  // Upload a sample
  async uploadSample(formData: FormData): Promise<Sample> {
    const response = await fetch(`${API}/samples/upload`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Upload failed');
    }
    return response.json();
  },

  // Delete a sample
  async deleteSample(id: string): Promise<void> {
    const response = await fetch(`${API}/samples/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete sample');
  },

  // Get audio URL (full URL with backend)
  getAudioUrl(audioPath: string): string {
    if (audioPath.startsWith('http') || audioPath.startsWith('data:')) {
      return audioPath;
    }
    return `${BACKEND_URL}${audioPath}`;
  }
};

// Share & Feedback & Summary API
export const shareApi = {
  // Share a generation and get a public token
  async shareTrack(generationId) {
    const response = await fetch(`${API}/music/${generationId}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Share failed');
    }
    return response.json();
  },

  // Get a shared track and its feedbacks by token
  async getSharedTrack(token) {
    const response = await fetch(`${API}/shared/${token}`);
    if (!response.ok) throw new Error('Track not found');
    return response.json();
  },

  // Submit feedback on a shared track
  async submitFeedback(token, feedback) {
    const response = await fetch(`${API}/shared/${token}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Feedback submission failed');
    }
    return response.json();
  },

  // Get the AI-generated daily summary
  async getDailySummary(date) {
    const url = date ? `${API}/summary/daily?date=${date}` : `${API}/summary/daily`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch summary');
    return response.json();
  },

  // Trigger a new daily summary generation (admin/cron)
  async generateDailySummary() {
    const response = await fetch(`${API}/summary/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Summary generation failed');
    return response.json();
  },
};

export default musicApi;
