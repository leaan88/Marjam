import React from 'react';
import { Lock } from 'lucide-react';
import { scenarios } from '../data/mock';

const Scenarios = () => {
  return (
    <section className="w-full max-w-3xl mx-auto mt-12">
      <h2 className="text-2xl font-light text-white mb-6">Scenarios</h2>
      
      <div className="flex flex-wrap gap-3">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            className="group flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-200"
          >
            {scenario.locked && (
              <Lock className="w-3.5 h-3.5 text-white/50" />
            )}
            <span className="text-sm text-white/80 group-hover:text-white transition-colors">
              {scenario.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Scenarios;
