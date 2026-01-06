import React, { useState } from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import Scenarios from '../components/Scenarios';
import SoundscapeSection from '../components/SoundscapeSection';
import Player from '../components/Player';
import { focusSoundscapes, relaxSoundscapes, sleepSoundscapes } from '../data/mock';

const HomePage = () => {
  const [currentTrack, setCurrentTrack] = useState({
    id: 1,
    name: 'Focus',
    icon: 'globe',
    section: 'Focus'
  });
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (track, section) => {
    setCurrentTrack({ ...track, section });
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="pt-24 pb-32 px-6">
        {/* Banner Carousel */}
        <Banner />
        
        {/* Scenarios Section */}
        <Scenarios />
        
        {/* Soundscape Sections */}
        <SoundscapeSection 
          title="Focus" 
          soundscapes={focusSoundscapes}
          onPlay={(track) => handlePlay(track, 'Focus')}
          currentPlaying={currentTrack}
        />
        
        <SoundscapeSection 
          title="Relax" 
          soundscapes={relaxSoundscapes}
          onPlay={(track) => handlePlay(track, 'Relax')}
          currentPlaying={currentTrack}
        />
        
        <SoundscapeSection 
          title="Sleep" 
          soundscapes={sleepSoundscapes}
          onPlay={(track) => handlePlay(track, 'Sleep')}
          currentPlaying={currentTrack}
        />
      </main>
      
      {/* Bottom Player */}
      <Player 
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
      />
    </div>
  );
};

export default HomePage;
