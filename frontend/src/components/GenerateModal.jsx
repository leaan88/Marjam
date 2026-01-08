import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, Music2, Wand2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { musicApi } from '../services/api';

const GenerateModal = ({ isOpen, onClose, onGenerated, activeMoods = [] }) => {
  const [prompt, setPrompt] = useState('');
  const [bpm, setBpm] = useState(120);
  const [duration, setDuration] = useState(8);
  const [provider, setProvider] = useState('replicate');
  const [loopType, setLoopType] = useState('full');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [providers, setProviders] = useState([]);

  // Get mood from active moods
  const mood = activeMoods.length > 0 ? activeMoods[0] : 'groovy';

  useEffect(() => {
    // Fetch available providers
    const fetchProviders = async () => {
      try {
        const data = await musicApi.getProviders();
        setProviders(data.providers || []);
      } catch (err) {
        console.error('Failed to fetch providers:', err);
      }
    };
    if (isOpen) {
      fetchProviders();
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please describe the sound you want');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const result = await musicApi.generateLoop({
        prompt: prompt.trim(),
        mood,
        bpm,
        duration,
        provider,
        loop_type: loopType
      });

      if (result.success) {
        onGenerated(result);
        onClose();
        setPrompt('');
      } else {
        setError(result.error || 'Generation failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate');
    } finally {
      setIsGenerating(false);
    }
  };

  const loopTypes = [
    { value: 'full', label: 'Full Loop' },
    { value: 'drums', label: 'Drums Only' },
    { value: 'bass', label: 'Bass Only' },
    { value: 'synth', label: 'Synth/Pad' },
    { value: 'lead', label: 'Lead/Melody' },
    { value: 'fx', label: 'FX/Risers' }
  ];

  const durationOptions = [
    { value: 8, label: '8 bars (~4 sec)' },
    { value: 16, label: '16 bars (~8 sec)' },
    { value: 32, label: '32 bars (~16 sec)' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-900 border-white/10 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-light text-white flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-400" />
            Generate AI Loop
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-5">
          {/* Prompt Input */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Describe your sound</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Deep house kick with punchy attack, minimal techno hi-hats, funky bass line..."
              className="bg-white/5 border-white/10 text-white placeholder-white/30 min-h-[80px]"
              disabled={isGenerating}
            />
          </div>

          {/* Provider Selection */}
          <div>
            <label className="block text-sm text-white/70 mb-2">AI Provider</label>
            <Select value={provider} onValueChange={setProvider} disabled={isGenerating}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-white/10">
                {providers.map((p) => (
                  <SelectItem 
                    key={p.id} 
                    value={p.id}
                    disabled={!p.available}
                    className="text-white hover:bg-white/10"
                  >
                    <div className="flex flex-col">
                      <span>{p.name}</span>
                      <span className="text-xs text-white/50">{p.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Loop Type */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Loop Type</label>
            <Select value={loopType} onValueChange={setLoopType} disabled={isGenerating}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-white/10">
                {loopTypes.map((type) => (
                  <SelectItem 
                    key={type.value} 
                    value={type.value}
                    className="text-white hover:bg-white/10"
                  >
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* BPM Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-white/70">BPM</label>
              <span className="text-sm text-purple-400 font-medium">{bpm}</span>
            </div>
            <Slider
              value={[bpm]}
              onValueChange={(v) => setBpm(v[0])}
              min={60}
              max={180}
              step={1}
              disabled={isGenerating}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-white/40 mt-1">
              <span>60</span>
              <span>120</span>
              <span>180</span>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Duration</label>
            <div className="flex gap-2">
              {durationOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDuration(opt.value)}
                  disabled={isGenerating}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all ${
                    duration === opt.value
                      ? 'bg-purple-500/30 border border-purple-500/50 text-purple-300'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Mood Display */}
          {mood && (
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-white/50">Mood:</span>
              <span className="text-purple-300 capitalize">{mood}</span>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating... (30-60 sec)
              </>
            ) : (
              <>
                <Music2 className="w-4 h-4 mr-2" />
                Generate Loop
              </>
            )}
          </Button>

          <p className="text-center text-xs text-white/40">
            Generation typically takes 30-60 seconds depending on the provider
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateModal;
