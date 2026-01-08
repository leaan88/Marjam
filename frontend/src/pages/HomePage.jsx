import React, { useState, useEffect, useRef } from 'react';
import { Plus, Wand2, Upload, FolderOpen } from 'lucide-react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import MoodParameters from '../components/Scenarios';
import LoopSection from '../components/SoundscapeSection';
import Player from '../components/Player';
import SignInModal from '../components/SignInModal';
import PremiumModal from '../components/PremiumModal';
import DownloadModal from '../components/DownloadModal';
import GenerateModal from '../components/GenerateModal';
import UploadModal from '../components/UploadModal';
import { drumLoops, bassLoops, synthLoops, fxLoops, moodParameters } from '../data/mock';
import { samplesApi } from '../services/api';
import { Button } from '../components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const HomePage = () => {
  const [currentLoop, setCurrentLoop] = useState({
    id: 1,
    name: 'Kick Foundation',
    icon: 'drums',
    bpm: 120,
    bars: 8,
    section: 'Drums'
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('');
  const [selectedLoop, setSelectedLoop] = useState(null);
  const [activeMoods, setActiveMoods] = useState([1, 2, 3]);
  
  // User uploaded samples
  const [uploadedSamples, setUploadedSamples] = useState([]);
  
  // AI Generated loops
  const [generatedLoops, setGeneratedLoops] = useState([]);
  
  // Audio ref for playing generated audio
  const audioRef = useRef(null);

  // Load uploaded samples on mount
  useEffect(() => {
    loadSamples();
  }, []);

  const loadSamples = async () => {
    try {
      const data = await samplesApi.getSamples();
      // Convert samples to loop format
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

  const getIconForType = (type) => {
    const iconMap = {
      'drums': 'drums',
      'bass': 'subbass',
      'synth': 'pad',
      'lead': 'lead',
      'fx': 'riser',
      'full': 'fullkit'
    };
    return iconMap[type] || 'drums';
  };

  const handlePlay = (loop, section) => {
    if (loop.locked) {
      setSelectedFeature(loop.name);
      setShowPremium(true);
      return;
    }
    
    // If it has audio_url, play it
    if (loop.audio_url) {
      if (audioRef.current) {
        audioRef.current.src = loop.audio_url;
        audioRef.current.play().catch(err => {
          console.error('Playback failed:', err);
        });
        setIsPlaying(true);
      }
    }
    
    setCurrentLoop({ ...loop, section, bars: 8 });
    setIsPlaying(true);
  };

  const handleDownload = (loop) => {
    if (loop.locked) {
      setSelectedFeature(loop.name);
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
    if (mood.locked) {
      setSelectedFeature(mood.name + ' mood');
      setShowPremium(true);
    }
  };

  const handleToggleMood = (moodId) => {
    setActiveMoods(prev => 
      prev.includes(moodId) 
        ? prev.filter(id => id !== moodId)
        : [...prev, moodId]
    );
  };

  // Handle new AI generated loop
  const handleGenerated = (result) => {
    const newLoop = {
      id: result.generation_id || Date.now(),
      name: result.prompt?.slice(0, 30) + '...' || 'AI Generated',
      icon: result.loop_type === 'drums' ? 'drums' : 
            result.loop_type === 'bass' ? 'subbass' :
            result.loop_type === 'synth' ? 'pad' :
            result.loop_type === 'lead' ? 'lead' : 'drums',
      bpm: result.bpm || 120,
      locked: false,
      audio_url: result.audio_url,
      provider: result.provider,
      mood: result.mood,
      isGenerated: true
    };
    
    setGeneratedLoops(prev => [newLoop, ...prev]);
    
    // Auto-play the generated loop
    if (result.audio_url) {
      setCurrentLoop({ ...newLoop, section: 'AI Generated', bars: 8 });
      if (audioRef.current) {
        audioRef.current.src = result.audio_url;
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  // Handle new uploaded sample
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
    
    // Auto-play the uploaded sample
    setCurrentLoop({ ...newLoop, section: 'My Samples', bars: 8 });
    if (audioRef.current) {
      audioRef.current.src = newLoop.audio_url;
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  // Get active mood names for generation
  const getActiveMoodNames = () => {
    return activeMoods
      .map(id => moodParameters.find(m => m.id === id)?.name?.toLowerCase())
      .filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header onSignInClick={() => setShowSignIn(true)} />
      
      {/* Hidden audio element for playback */}
      <audio 
        ref={audioRef} 
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />
      
      <main className="pt-24 pb-32 px-6">
        {/* Banner Carousel */}
        <Banner />
        
        {/* Action Buttons */}
        <div className="w-full max-w-3xl mx-auto mt-8 flex gap-4">
          <Button
            onClick={() => setShowGenerate(true)}
            className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium text-base rounded-xl"
          >
            <Wand2 className="w-5 h-5 mr-2" />
            Generate AI Loop
          </Button>
          <Button
            onClick={() => setShowUpload(true)}
            className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white font-medium text-base rounded-xl border border-white/10"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Sample
          </Button>
        </div>
        
        {/* Mood Parameters Section */}
        <MoodParameters 
          onMoodClick={handleMoodClick}
          activeMoods={activeMoods}
          onToggleMood={handleToggleMood}
        />
        
        {/* Uploaded Samples Section */}
        {uploadedSamples.length > 0 && (
          <LoopSection 
            title="📁 My Samples" 
            loops={uploadedSamples}
            onPlay={(loop) => handlePlay(loop, 'My Samples')}
            onDownload={handleDownload}
            currentPlaying={currentLoop}
          />
        )}
        
        {/* AI Generated Loops Section */}
        {generatedLoops.length > 0 && (
          <LoopSection 
            title="🎵 AI Generated" 
            loops={generatedLoops}
            onPlay={(loop) => handlePlay(loop, 'AI Generated')}
            onDownload={handleDownload}
            currentPlaying={currentLoop}
          />
        )}
        
        {/* Loop Sections */}
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
      
      {/* Bottom Player */}
      <Player 
        currentLoop={currentLoop}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onStop={handleStop}
      />
      
      {/* Modals */}
      <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
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
    </div>
  );
};

export default HomePage;
