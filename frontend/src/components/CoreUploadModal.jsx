import React, { useState, useRef } from 'react';
import { Upload, X, Music2, Loader2, Database } from 'lucide-react';
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

const CoreUploadModal = ({ isOpen, onClose, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [bpm, setBpm] = useState(120);
  const [loopType, setLoopType] = useState('full');
  const [mood, setMood] = useState('groovy');
  const [category, setCategory] = useState('loops');
  const [tags, setTags] = useState('');
  const [musicalKey, setMusicalKey] = useState('');
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
    { value: 'fx', label: 'FX/Risers' },
    { value: 'vocals', label: 'Vocals' },
    { value: 'percussion', label: 'Percussion' }
  ];

  const categories = [
    { value: 'loops', label: 'Loops' },
    { value: 'oneshots', label: 'One Shots' },
    { value: 'stems', label: 'Stems' },
    { value: 'fx', label: 'FX & Transitions' },
    { value: 'vocals', label: 'Vocals' }
  ];

  const moods = [
    'peaceful', 'focus', 'groovy', 'introspective', 'uplift',
    'darker', 'lighter', 'banging', 'minimal', 'complex',
    'hypnotic', 'energetic', 'chill', 'aggressive', 'dreamy'
  ];

  const musicalKeys = [
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
    'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm'
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
    const allowedExtensions = ['.wav', '.mp3', '.flac', '.ogg', '.m4a', '.aiff'];
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    
    if (!allowedExtensions.includes(ext)) {
      setError('Please upload an audio file (WAV, MP3, FLAC, OGG, M4A, AIFF)');
      return;
    }
    
    setFile(selectedFile);
    setError('');
    
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
    formData.append('category', category);
    formData.append('tags', tags);
    if (musicalKey) {
      formData.append('key', musicalKey);
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/core-samples/upload`, {
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
      setCategory('loops');
      setTags('');
      setMusicalKey('');
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
      <DialogContent className="bg-neutral-900 border-white/10 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-light text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-red-400" />
            Upload Core Sample
            <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded">ADMIN</span>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-red-500 bg-red-500/10'
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
                <Music2 className="w-6 h-6 text-green-400" />
                <div className="text-left">
                  <p className="text-white font-medium text-sm">{file.name}</p>
                  <p className="text-white/50 text-xs">
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
                  <X className="w-4 h-4 text-white/50" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                <p className="text-white/70 text-sm">Drop audio file here or click to browse</p>
              </>
            )}
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-xs text-white/70 mb-1.5">Sample Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Funky Drum Break"
              className="bg-white/5 border-white/10 text-white placeholder-white/30 text-sm"
              disabled={isUploading}
            />
          </div>

          {/* Category & Loop Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/70 mb-1.5">Category</label>
              <Select value={category} onValueChange={setCategory} disabled={isUploading}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-white/10">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-white/10 text-sm">
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs text-white/70 mb-1.5">Type</label>
              <Select value={loopType} onValueChange={setLoopType} disabled={isUploading}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-white/10">
                  {loopTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-white hover:bg-white/10 text-sm">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mood & Key */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/70 mb-1.5">Mood</label>
              <Select value={mood} onValueChange={setMood} disabled={isUploading}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white text-sm capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-white/10 max-h-48">
                  {moods.map((m) => (
                    <SelectItem key={m} value={m} className="text-white hover:bg-white/10 capitalize text-sm">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs text-white/70 mb-1.5">Key (optional)</label>
              <Select value={musicalKey} onValueChange={setMusicalKey} disabled={isUploading}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white text-sm">
                  <SelectValue placeholder="Select key" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-white/10 max-h-48">
                  <SelectItem value="" className="text-white/50 hover:bg-white/10 text-sm">None</SelectItem>
                  {musicalKeys.map((k) => (
                    <SelectItem key={k} value={k} className="text-white hover:bg-white/10 text-sm">
                      {k}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* BPM Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs text-white/70">BPM</label>
              <span className="text-xs text-purple-400 font-medium">{bpm}</span>
            </div>
            <Slider
              value={[bpm]}
              onValueChange={(v) => setBpm(v[0])}
              min={60}
              max={200}
              step={1}
              disabled={isUploading}
              className="py-1"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs text-white/70 mb-1.5">Tags (comma separated)</label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., funky, disco, house"
              className="bg-white/5 border-white/10 text-white placeholder-white/30 text-sm"
              disabled={isUploading}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={isUploading || !file || !name.trim()}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-medium"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading to Core...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Upload to Core Library
              </>
            )}
          </Button>

          <p className="text-center text-xs text-white/40">
            Core samples are permanent and used for song creation
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoreUploadModal;
