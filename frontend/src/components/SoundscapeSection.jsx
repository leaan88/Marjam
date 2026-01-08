import React, { useMemo } from 'react';
import { Lock, Play, Download, Sparkles } from 'lucide-react';
import { getIconComponent } from './icons/SoundscapeIcons';

const LoopItem = ({ item, onPlay, onDownload, isPlaying }) => {
  const IconComponent = useMemo(() => getIconComponent(item.icon), [item.icon]);
  
  return (
    <div 
      className={`group flex items-center justify-between py-4 px-2 hover:bg-white/5 rounded-lg transition-all duration-200 cursor-pointer ${
        item.isGenerated ? 'border-l-2 border-purple-500/50' : ''
      }`}
      onClick={() => onPlay(item)}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center relative">
          <IconComponent className="w-10 h-10 text-white/80 group-hover:text-white transition-colors" />
          {item.isGenerated && (
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className={`text-base font-light ${
            item.locked ? 'text-white/60' : 'text-white'
          } group-hover:text-white transition-colors`}>
            {item.name}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">{item.bpm} BPM</span>
            {item.provider && (
              <span className="text-xs text-purple-400/70 capitalize">• {item.provider}</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {item.locked ? (
          <Lock className="w-4 h-4 text-white/40" />
        ) : (
          <>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDownload(item);
              }}
              className="p-2 rounded-full hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
              title="Download Loop"
            >
              <Download className="w-4 h-4 text-white/60 hover:text-white" />
            </button>
            <Play className={`w-5 h-5 text-white/60 group-hover:text-white transition-all duration-200 ${
              isPlaying ? 'opacity-100 text-purple-400' : 'opacity-0 group-hover:opacity-100'
            }`} />
          </>
        )}
      </div>
    </div>
  );
};

const LoopSection = ({ title, loops, onPlay, onDownload, currentPlaying }) => {
  return (
    <section className="w-full max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-light text-white mb-2">{title}</h2>
      
      <div className="divide-y divide-white/5">
        {loops.map((item) => (
          <LoopItem 
            key={item.id} 
            item={item} 
            onPlay={onPlay}
            onDownload={onDownload}
            isPlaying={currentPlaying?.id === item.id && currentPlaying?.section === title}
          />
        ))}
      </div>
    </section>
  );
};

export default LoopSection;
