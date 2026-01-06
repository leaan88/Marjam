import React, { useMemo } from 'react';
import { Lock, Play } from 'lucide-react';
import { getIconComponent } from './icons/SoundscapeIcons';

const SoundscapeItem = ({ item, onPlay, isPlaying }) => {
  const IconComponent = useMemo(() => getIconComponent(item.icon), [item.icon]);
  
  return (
    <div 
      className="group flex items-center justify-between py-4 px-2 hover:bg-white/5 rounded-lg transition-all duration-200 cursor-pointer"
      onClick={() => onPlay(item)}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center">
          <IconComponent className="w-10 h-10 text-white/80 group-hover:text-white transition-colors" />
        </div>
        <span className={`text-base font-light ${
          item.locked ? 'text-white/60' : 'text-white'
        } group-hover:text-white transition-colors`}>
          {item.name}
        </span>
      </div>
      
      <div className="flex items-center">
        {item.locked ? (
          <Lock className="w-4 h-4 text-white/40" />
        ) : (
          <Play className={`w-5 h-5 text-white/60 group-hover:text-white transition-all duration-200 ${
            isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`} />
        )}
      </div>
    </div>
  );
};

const SoundscapeSection = ({ title, soundscapes, onPlay, currentPlaying }) => {
  return (
    <section className="w-full max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-light text-white mb-2">{title}</h2>
      
      <div className="divide-y divide-white/5">
        {soundscapes.map((item) => (
          <SoundscapeItem 
            key={item.id} 
            item={item} 
            onPlay={onPlay}
            isPlaying={currentPlaying?.id === item.id && currentPlaying?.section === title}
          />
        ))}
      </div>
    </section>
  );
};

export default SoundscapeSection;
