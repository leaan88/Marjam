import React, { useMemo } from 'react';
import { Play, Pause } from 'lucide-react';
import { getIconComponent } from './icons/SoundscapeIcons';

const Player = ({ currentTrack, isPlaying, onPlayPause }) => {
  const IconComponent = useMemo(() => {
    return currentTrack ? getIconComponent(currentTrack.icon) : null;
  }, [currentTrack?.icon]);
  
  if (!currentTrack || !IconComponent) return null;
  
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-4 bg-neutral-900/95 backdrop-blur-md border border-white/10 rounded-full px-4 py-3 shadow-2xl shadow-black/50">
        {/* Track Icon */}
        <div className="w-10 h-10 flex items-center justify-center">
          <IconComponent className="w-8 h-8 text-white/80" />
        </div>
        
        {/* Track Info */}
        <div className="flex flex-col min-w-[100px]">
          <span className="text-[11px] text-white/50 font-medium">
            {isPlaying ? 'Playing' : 'Paused'}
          </span>
          <span className="text-sm text-white font-light">
            {currentTrack.name}
          </span>
        </div>
        
        {/* Play/Pause Button */}
        <button
          onClick={onPlayPause}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors duration-200"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Player;
