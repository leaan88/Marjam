import React, { useState, useEffect, useRef } from 'react';
import { Wand2, Upload, Database, Music } from 'lucide-react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import MoodParameters from '../components/Scenarios';
import LoopSection from '../components/SoundscapeSection';
import Player from '../components/Player';
import LoginModal from '../components/LoginModal';
import PremiumModal from '../components/PremiumModal';
import DownloadModal from '../components/DownloadModal';
import GenerateModal from '../components/GenerateModal';
import UploadModal from '../components/UploadModal';
import CoreUploadModal from '../components/CoreUploadModal';
import { drumLoops, bassLoops, synthLoops, fxLoops, moodParameters } from '../data/mock';
import { samplesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const HomePage = () => {
  const { user, isAuthenticated, isAdmin, canDownload, limits } = useAuth();
  
  const [currentLoop, setCurrentLoop] = useState({
    id: 1,
    name: 'Kick Foundation',
    icon: 'drums',
    bpm: 120,
    bars: 8,
    section: 'Drums'
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showCoreUpload, setShowCoreUpload] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('');
  const [selectedLoop, setSelectedLoop] = useState(null);
  const [activeMoods, setActiveMoods] = useState([1, 2, 3]);
  
  // Samples
  const [uploadedSamples, setUploadedSamples] = useState([]);
  const [coreSamples, setCoreSamples] = useState([]);
  const [generatedLoops, setGeneratedLoops] = useState([]);
  
  const audioRef = useRef(null);

  // Load samples on mount
  useEffect(() => {
    loadSamples();
    loadCoreSamples();
  }, []);

  const loadSamples = async () => {
    try {
      const data = await samplesApi.getSamples();
      const loops = data.samples.map(sample => ({
        id: sample.id,
        name: sample.name,
        icon: getIconForType(sample.loop_type),
        bpm: sample.bpm,
        locked: false,
        audio_url: samplesApi.getAudioUrl(sample.audio_url),
        mood: sample.mood,
        loop_type: sample.loop_type,
        isUploaded: true
      }));
      setUploadedSamples(loops);
    } catch (err) {
      console.error('Failed to load samples:', err);
    }
  };

  const loadCoreSamples = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/core-samples`);
      const data = await response.json();
      const loops = (data.core_samples || []).map(sample => ({
        id: sample.id,
        name: sample.name,
        icon: getIconForType(sample.loop_type),
        bpm: sample.bpm,
        locked: false,
        audio_url: `${BACKEND_URL}${sample.audio_url}`,
        mood: sample.mood,
        loop_type: sample.loop_type,
        category: sample.category,
        tags: sample.tags,
        key: sample.key,
        isCore: true
      }));
      setCoreSamples(loops);
    } catch (err) {
      console.error('Failed to load core samples:', err);
    }
  };

  const getIconForType = (type) => {
    const iconMap = {
      'drums': 'drums',
      'bass': 'subbass',
      'synth': 'pad',
      'lead': 'lead',
      'fx': 'riser',
      'full': 'fullkit',
      'percussion': 'percussion',
      'vocals': 'lead'
    };
    return iconMap[type] || 'drums';
  };

  const handlePlay = (loop, section) => {
    if (loop.locked) {
      setSelectedFeature(loop.name);
      setShowPremium(true);
      return;
    }
    
    if (loop.audio_url) {
      if (audioRef.current) {
        audioRef.current.src = loop.audio_url;
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
    
    setCurrentLoop({ ...loop, section, bars: 8 });
    setIsPlaying(true);
  };

  const handleDownload = (loop) => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }
    if (!canDownload()) {
      setSelectedFeature('Download');
      setShowPremium(true);
      return;
    }
    setSelectedLoop(loop);
    setShowDownload(true);
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const handleMoodClick = (mood) => {
    if (mood.locked && !isAuthenticated) {
      setShowLogin(true);
      return;
    }
    if (mood.locked) {
      setSelectedFeature(mood.name + ' mood');
      setShowPremium(true);
    }
  };

  const handleToggleMood = (moodId) => {
    const mood = moodParameters.find(m => m.id === moodId);
    if (mood?.locked && limits?.locked_moods?.includes(mood.name.toLowerCase())) {
      setSelectedFeature(mood.name + ' mood');
      setShowPremium(true);
      return;
    }
    setActiveMoods(prev => 
      prev.includes(moodId) 
        ? prev.filter(id => id !== moodId)
        : [...prev, moodId]
    );
  };

  const handleGenerated = (result) => {
    const newLoop = {
      id: result.generation_id || Date.now(),
      name: result.prompt?.slice(0, 30) + '...' || 'AI Generated',
      icon: getIconForType(result.loop_type),
      bpm: result.bpm || 120,
      locked: false,
      audio_url: result.audio_url,
      provider: result.provider,
      mood: result.mood,
      isGenerated: true
    };
    
    setGeneratedLoops(prev => [newLoop, ...prev]);
    
    if (result.audio_url) {
      setCurrentLoop({ ...newLoop, section: 'AI Generated', bars: 8 });
      if (audioRef.current) {
        audioRef.current.src = result.audio_url;
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  const handleUploaded = (sample) => {
    const newLoop = {
      id: sample.id,
      name: sample.name,
      icon: getIconForType(sample.loop_type),
      bpm: sample.bpm,
      locked: false,
      audio_url: samplesApi.getAudioUrl(sample.audio_url),
      mood: sample.mood,
      loop_type: sample.loop_type,
      isUploaded: true
    };
    
    setUploadedSamples(prev => [newLoop, ...prev]);
    
    setCurrentLoop({ ...newLoop, section: 'My Samples', bars: 8 });
    if (audioRef.current) {
      audioRef.current.src = newLoop.audio_url;
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleCoreUploaded = (sample) => {
    const newLoop = {
      id: sample.id,
      name: sample.name,
      icon: getIconForType(sample.loop_type),
      bpm: sample.bpm,
      locked: false,
      audio_url: `${BACKEND_URL}${sample.audio_url}`,
      mood: sample.mood,
      loop_type: sample.loop_type,
      category: sample.category,
      tags: sample.tags,
      isCore: true
    };
    
    setCoreSamples(prev => [newLoop, ...prev]);
    
    setCurrentLoop({ ...newLoop, section: 'Core Library', bars: 8 });
    if (audioRef.current) {
      audioRef.current.src = newLoop.audio_url;
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleDeleteSample = async (loop) => {
    if (!loop.isUploaded) return;
    
    try {
      await samplesApi.deleteSample(loop.id);
      setUploadedSamples(prev => prev.filter(s => s.id !== loop.id));
      
      if (currentLoop?.id === loop.id) {
        handleStop();
      }
    } catch (err) {
      console.error('Failed to delete sample:', err);
    }
  };

  const getActiveMoodNames = () => {
    return activeMoods
      .map(id => moodParameters.find(m => m.id === id)?.name?.toLowerCase())
      .filter(Boolean);
  };

  // Group core samples by category
  const groupedCoreSamples = coreSamples.reduce((acc, sample) => {
    const cat = sample.category || 'loops';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(sample);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-black">
      <Header onSignInClick={() => setShowLogin(true)} />
      
      <audio 
        ref={audioRef} 
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />
      
      <main className="pt-24 pb-32 px-6">
        <Banner />
        
        {/* Action Buttons */}
        <div className="w-full max-w-3xl mx-auto mt-8 flex gap-3 flex-wrap">
          <Button
            onClick={() => isAuthenticated ? setShowGenerate(true) : setShowLogin(true)}
            className="flex-1 min-w-[140px] py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium text-sm rounded-xl"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Generate AI
          </Button>
          <Button
            onClick={() => isAuthenticated ? setShowUpload(true) : setShowLogin(true)}
            className="flex-1 min-w-[140px] py-4 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl border border-white/10"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          {isAdmin() && (
            <Button
              onClick={() => setShowCoreUpload(true)}
              className="flex-1 min-w-[140px] py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium text-sm rounded-xl"
            >
              <Database className="w-4 h-4 mr-2" />
              Core Upload
            </Button>
          )}
        </div>
        
        <MoodParameters 
          onMoodClick={handleMoodClick}
          activeMoods={activeMoods}
          onToggleMood={handleToggleMood}
        />
        
        {/* Core Samples Library */}
        {coreSamples.length > 0 && (
          <LoopSection 
            title="🎹 Core Library" 
            loops={coreSamples}
            onPlay={(loop) => handlePlay(loop, 'Core Library')}
            onDownload={handleDownload}
            currentPlaying={currentLoop}
          />
        )}
        
        {uploadedSamples.length > 0 && (
          <LoopSection 
            title="📁 My Samples" 
            loops={uploadedSamples}
            onPlay={(loop) => handlePlay(loop, 'My Samples')}
            onDownload={handleDownload}
            onDelete={handleDeleteSample}
            currentPlaying={currentLoop}
          />
        )}
        
        {generatedLoops.length > 0 && (
          <LoopSection 
            title="🎵 AI Generated" 
            loops={generatedLoops}
            onPlay={(loop) => handlePlay(loop, 'AI Generated')}
            onDownload={handleDownload}
            currentPlaying={currentLoop}
          />
        )}
        
        <LoopSection 
          title="Drums" 
          loops={drumLoops}
          onPlay={(loop) => handlePlay(loop, 'Drums')}
          onDownload={handleDownload}
          currentPlaying={currentLoop}
        />
        
        <LoopSection 
          title="Bass" 
          loops={bassLoops}
          onPlay={(loop) => handlePlay(loop, 'Bass')}
          onDownload={handleDownload}
          currentPlaying={currentLoop}
        />
        
        <LoopSection 
          title="Synths" 
          loops={synthLoops}
          onPlay={(loop) => handlePlay(loop, 'Synths')}
          onDownload={handleDownload}
          currentPlaying={currentLoop}
        />
        
        <LoopSection 
          title="FX & Transitions" 
          loops={fxLoops}
          onPlay={(loop) => handlePlay(loop, 'FX')}
          onDownload={handleDownload}
          currentPlaying={currentLoop}
        />
      </main>
      
      <Player 
        currentLoop={currentLoop}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onStop={handleStop}
      />
      
      {/* Modals */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <PremiumModal 
        isOpen={showPremium} 
        onClose={() => setShowPremium(false)} 
        featureName={selectedFeature}
      />
      <DownloadModal
        isOpen={showDownload}
        onClose={() => setShowDownload(false)}
        loop={selectedLoop}
      />
      <GenerateModal
        isOpen={showGenerate}
        onClose={() => setShowGenerate(false)}
        onGenerated={handleGenerated}
        activeMoods={getActiveMoodNames()}
      />
      <UploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUploaded={handleUploaded}
      />
      <CoreUploadModal
        isOpen={showCoreUpload}
        onClose={() => setShowCoreUpload(false)}
        onUploaded={handleCoreUploaded}
      />
    </div>
  );
};

export default HomePage;
