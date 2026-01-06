import React, { useMemo } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { getIconComponent } from './icons/SoundscapeIcons';

const Player = ({ currentLoop, isPlaying, onPlayPause, onStop }) => {
  const IconComponent = useMemo(() => {
    return currentLoop ? getIconComponent(currentLoop.icon) : null;
  }, [currentLoop?.icon]);
  
  if (!currentLoop || !IconComponent) return null;
  
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-4 bg-neutral-900/95 backdrop-blur-md border border-white/10 rounded-full px-4 py-3 shadow-2xl shadow-black/50">
        {/* Loop Icon */}
        <div className="w-10 h-10 flex items-center justify-center">
          <IconComponent className="w-8 h-8 text-white/80" />
        </div>
        
        {/* Loop Info */}
        <div className="flex flex-col min-w-[120px]">
          <span className="text-[11px] text-white/50 font-medium">
            {isPlaying ? 'Playing' : 'Paused'} • {currentLoop.bpm} BPM
          </span>
          <span className="text-sm text-white font-light">
            {currentLoop.name}
          </span>
        </div>
        
        {/* Bar Length Indicator */}
        <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
          <span className="text-xs text-purple-300 font-medium">{currentLoop.bars || 8} bars</span>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={onStop}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors duration-200"
          >
            <Square className="w-4 h-4 text-white/60" />
          </button>
          <button
            onClick={onPlayPause}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Player;
