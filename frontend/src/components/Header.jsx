import React from 'react';

const Header = ({ onSignInClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Marjam Logo */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-6 h-6 text-white">
              <rect x="6" y="12" width="4" height="14" rx="1" fill="currentColor" />
              <rect x="12" y="8" width="4" height="18" rx="1" fill="currentColor" />
              <rect x="18" y="10" width="4" height="16" rx="1" fill="currentColor" />
              <rect x="24" y="14" width="4" height="12" rx="1" fill="currentColor" />
            </svg>
          </div>
          {/* Brand Name */}
          <span className="text-xl font-semibold text-white tracking-tight">Marjam</span>
          {/* Free Badge */}
          <span className="px-2.5 py-1 text-[10px] font-medium tracking-[0.15em] text-white/70 border border-white/20 rounded">
            FREE
          </span>
        </div>

        {/* Sign In Button */}
        <button 
          onClick={onSignInClick}
          className="px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
        >
          Sign In
        </button>
      </div>
    </header>
  );
};

export default Header;
