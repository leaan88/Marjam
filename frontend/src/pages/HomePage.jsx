import React, { useState, useEffect, useRef } from 'react';
import { Plus, Wand2 } from 'lucide-react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import MoodParameters from '../components/Scenarios';
import LoopSection from '../components/SoundscapeSection';
import Player from '../components/Player';
import SignInModal from '../components/SignInModal';
import PremiumModal from '../components/PremiumModal';
import DownloadModal from '../components/DownloadModal';
import GenerateModal from '../components/GenerateModal';
import { drumLoops, bassLoops, synthLoops, fxLoops, moodParameters } from '../data/mock';
import { Button } from '../components/ui/button';

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
  const [selectedFeature, setSelectedFeature] = useState('');
  const [selectedLoop, setSelectedLoop] = useState(null);
  const [activeMoods, setActiveMoods] = useState([1, 2, 3]); // Peaceful, Focus, Groovy are free
  
  // AI Generated loops
  const [generatedLoops, setGeneratedLoops] = useState([]);
  
  // Audio ref for playing generated audio
  const audioRef = useRef(null);

  const handlePlay = (loop, section) => {
    if (loop.locked) {
      setSelectedFeature(loop.name);
      setShowPremium(true);
      return;
    }
    
    // If it's a generated loop with audio_url, play it
    if (loop.audio_url) {
      if (audioRef.current) {
        audioRef.current.src = loop.audio_url;
        audioRef.current.play();
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
        audioRef.current.play();
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
        audioRef.current.play();
        setIsPlaying(true);
      }
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
        
        {/* AI Generate Button */}
        <div className="w-full max-w-3xl mx-auto mt-8">
          <Button
            onClick={() => setShowGenerate(true)}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium text-lg rounded-xl"
          >
            <Wand2 className="w-5 h-5 mr-2" />
            Generate AI Loop
          </Button>
        </div>
        
        {/* Mood Parameters Section */}
        <MoodParameters 
          onMoodClick={handleMoodClick}
          activeMoods={activeMoods}
          onToggleMood={handleToggleMood}
        />
        
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
    </div>
  );
};

export default HomePage;
