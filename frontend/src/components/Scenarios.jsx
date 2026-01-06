import React from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { moodParameters } from '../data/mock';

const MoodParameters = ({ onMoodClick, activeMoods, onToggleMood }) => {
  return (
    <section className="w-full max-w-3xl mx-auto mt-12">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h2 className="text-2xl font-light text-white">Mood Parameters</h2>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {moodParameters.map((mood) => {
          const isActive = activeMoods?.includes(mood.id);
          return (
            <button
              key={mood.id}
              onClick={() => mood.locked ? onMoodClick(mood) : onToggleMood(mood.id)}
              className={`group flex items-center gap-2 px-4 py-2.5 border rounded-full transition-all duration-200 ${
                isActive 
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' 
                  : 'bg-white/5 hover:bg-white/10 border-white/10'
              }`}
            >
              {mood.locked && (
                <Lock className="w-3.5 h-3.5 text-white/50" />
              )}
              <span className={`text-sm transition-colors ${
                isActive ? 'text-purple-300' : 'text-white/80 group-hover:text-white'
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
