import React from 'react';
import { LogOut, User, Crown, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ onSignInClick }) => {
  const { user, logout, isAuthenticated, isAdmin, isPremium } = useAuth();

  const getTierBadge = () => {
    if (!user) return null;
    
    if (user.tier === 'admin') {
      return (
        <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium tracking-[0.1em] text-red-300 bg-red-500/20 border border-red-500/30 rounded">
          <Shield className="w-3 h-3" />
          ADMIN
        </span>
      );
    }
    if (user.tier === 'premium') {
      return (
        <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium tracking-[0.1em] text-yellow-300 bg-yellow-500/20 border border-yellow-500/30 rounded">
          <Crown className="w-3 h-3" />
          PREMIUM
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 text-[10px] font-medium tracking-[0.15em] text-white/70 border border-white/20 rounded">
        FREE
      </span>
    );
  };

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
          {/* Tier Badge */}
          {getTierBadge()}
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <User className="w-4 h-4" />
                <span>{user?.name}</span>
              </div>
              <button 
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <button 
              onClick={onSignInClick}
              className="px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
