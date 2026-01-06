import React from 'react';
import { Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

const PremiumModal = ({ isOpen, onClose, featureName }) => {
  const features = [
    'Unlimited access to all soundscapes',
    'All scenarios unlocked',
    'Offline listening',
    'Apple Watch app',
    'Personalized sound adaptation',
    'Priority support'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-900 border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-light text-white text-center">
            Unlock {featureName || 'Premium Features'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-6">
          <p className="text-white/60 text-center text-sm mb-6">
            Get unlimited access to all soundscapes and features
          </p>
          
          {/* Features List */}
          <div className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-white/80 text-sm">{feature}</span>
              </div>
            ))}
          </div>
          
          {/* Pricing */}
          <div className="bg-white/5 rounded-xl p-4 mb-4">
            <div className="flex items-baseline justify-between">
              <span className="text-white/60 text-sm">Premium</span>
              <div className="text-right">
                <span className="text-2xl font-light text-white">$5.99</span>
                <span className="text-white/40 text-sm">/month</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-white text-sm font-medium">Annual</span>
                <span className="ml-2 px-2 py-0.5 bg-purple-500/30 text-purple-300 text-xs rounded-full">Save 30%</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-light text-white">$49.99</span>
                <span className="text-white/40 text-sm">/year</span>
              </div>
            </div>
          </div>
          
          {/* CTA Button */}
          <button className="w-full py-3.5 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors">
            Start Free Trial
          </button>
          
          <p className="mt-4 text-center text-xs text-white/40">
            7-day free trial, cancel anytime
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;
