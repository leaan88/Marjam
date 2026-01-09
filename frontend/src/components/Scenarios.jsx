import React from 'react';
import { Lock, Sparkles, Crown } from 'lucide-react';
import { moodParameters as defaultMoods } from '../data/mock';

const MoodParameters = ({ onMoodClick, activeMoods, onToggleMood, moods }) => {
  const moodList = moods || defaultMoods;
  
  return (
    <section className="w-full max-w-3xl mx-auto mt-8">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-light text-white">Mood Parameters</h2>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {moodList.map((mood) => {
          const isActive = activeMoods?.includes(mood.id);
          const tierColor = mood.tier === 'admin' ? 'red' : mood.tier === 'premium' ? 'yellow' : 'purple';
          
          return (
            <button
              key={mood.id}
              onClick={() => mood.locked ? onMoodClick(mood) : onToggleMood(mood.id)}
              className={`group flex items-center gap-2 px-3 py-2 border rounded-full transition-all duration-200 text-sm ${
                isActive 
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' 
                  : mood.locked
                  ? 'bg-white/5 border-white/10 opacity-60'
                  : 'bg-white/5 hover:bg-white/10 border-white/10'
              }`}
            >
              {mood.locked && (
                mood.tier === 'admin' ? (
                  <Crown className="w-3 h-3 text-red-400" />
                ) : mood.tier === 'premium' ? (
                  <Crown className="w-3 h-3 text-yellow-400" />
                ) : (
                  <Lock className="w-3 h-3 text-white/50" />
                )
              )}
              <span className={`transition-colors ${
                isActive ? 'text-purple-300' : mood.locked ? 'text-white/50' : 'text-white/80 group-hover:text-white'
              }`}>
                {mood.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default MoodParameters;
