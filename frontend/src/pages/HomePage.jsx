import React, { useState } from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import MoodParameters from '../components/Scenarios';
import LoopSection from '../components/SoundscapeSection';
import Player from '../components/Player';
import SignInModal from '../components/SignInModal';
import PremiumModal from '../components/PremiumModal';
import DownloadModal from '../components/DownloadModal';
import { drumLoops, bassLoops, synthLoops, fxLoops } from '../data/mock';

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
  const [selectedFeature, setSelectedFeature] = useState('');
  const [selectedLoop, setSelectedLoop] = useState(null);
  const [activeMoods, setActiveMoods] = useState([1, 2, 3]); // Peaceful, Focus, Groovy are free

  const handlePlay = (loop, section) => {
    if (loop.locked) {
      setSelectedFeature(loop.name);
      setShowPremium(true);
      return;
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
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
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

  return (
    <div className="min-h-screen bg-black">
      <Header onSignInClick={() => setShowSignIn(true)} />
      
      <main className="pt-24 pb-32 px-6">
        {/* Banner Carousel */}
        <Banner />
        
        {/* Mood Parameters Section */}
        <MoodParameters 
          onMoodClick={handleMoodClick}
          activeMoods={activeMoods}
          onToggleMood={handleToggleMood}
        />
        
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
    </div>
  );
};

export default HomePage;
