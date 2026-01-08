import React, { useState, useRef } from 'react';
import { Upload, X, Music2, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const UploadModal = ({ isOpen, onClose, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [bpm, setBpm] = useState(120);
  const [loopType, setLoopType] = useState('full');
  const [mood, setMood] = useState('groovy');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const loopTypes = [
    { value: 'full', label: 'Full Loop' },
    { value: 'drums', label: 'Drums' },
    { value: 'bass', label: 'Bass' },
    { value: 'synth', label: 'Synth/Pad' },
    { value: 'lead', label: 'Lead/Melody' },
    { value: 'fx', label: 'FX/Risers' }
  ];

  const moods = [
    'peaceful', 'focus', 'groovy', 'introspective', 'uplift',
    'darker', 'lighter', 'banging', 'minimal', 'complex',
    'hypnotic', 'energetic', 'chill', 'aggressive', 'dreamy'
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    const allowedTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/flac', 'audio/ogg', 'audio/x-m4a', 'audio/aiff'];
    const allowedExtensions = ['.wav', '.mp3', '.flac', '.ogg', '.m4a', '.aiff'];
    
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    
    if (!allowedTypes.includes(selectedFile.type) && !allowedExtensions.includes(ext)) {
      setError('Please upload an audio file (WAV, MP3, FLAC, OGG, M4A, AIFF)');
      return;
    }
    
    setFile(selectedFile);
    setError('');
    
    // Auto-fill name from filename
    if (!name) {
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, '');
      setName(fileName);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }
    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name.trim());
    formData.append('bpm', bpm.toString());
    formData.append('loop_type', loopType);
    formData.append('mood', mood);

    try {
      const response = await fetch(`${BACKEND_URL}/api/samples/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Upload failed');
      }

      const sample = await response.json();
      
      onUploaded(sample);
      
      // Reset form
      setFile(null);
      setName('');
      setBpm(120);
      setLoopType('full');
      setMood('groovy');
      onClose();
      
    } catch (err) {
      setError(err.message || 'Failed to upload');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setName('');
    setError('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-900 border-white/10 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-light text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-purple-400" />
            Upload Sample
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-5">
          {/* Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-purple-500 bg-purple-500/10'
                : file
                ? 'border-green-500/50 bg-green-500/5'
                : 'border-white/20 hover:border-white/40 hover:bg-white/5'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".wav,.mp3,.flac,.ogg,.m4a,.aiff,audio/*"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="hidden"
            />
            
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <Music2 className="w-8 h-8 text-green-400" />
                <div className="text-left">
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-white/50 text-sm">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetForm();
                  }}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <X className="w-5 h-5 text-white/50" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 text-white/40 mx-auto mb-3" />
                <p className="text-white/70">
                  Drag & drop your audio file here
                </p>
                <p className="text-white/40 text-sm mt-1">
                  or click to browse (WAV, MP3, FLAC, OGG)
                </p>
              </>
            )}
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Sample Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Funky Drum Break"
              className="bg-white/5 border-white/10 text-white placeholder-white/30"
              disabled={isUploading}
            />
          </div>

          {/* Loop Type & Mood */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Type</label>
              <Select value={loopType} onValueChange={setLoopType} disabled={isUploading}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-white/10">
                  {loopTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-white hover:bg-white/10">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Mood</label>
              <Select value={mood} onValueChange={setMood} disabled={isUploading}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-white/10 max-h-48">
                  {moods.map((m) => (
                    <SelectItem key={m} value={m} className="text-white hover:bg-white/10 capitalize">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
              max={200}
              step={1}
              disabled={isUploading}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-white/40 mt-1">
              <span>60</span>
              <span>130</span>
              <span>200</span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={isUploading || !file || !name.trim()}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Sample
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
