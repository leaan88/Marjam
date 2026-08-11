import React, { useState } from 'react';
import { Link2, Check, Share2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

const ShareModal = ({ isOpen, onClose, loop, shareToken }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = shareToken
    ? `${window.location.origin}/share/${shareToken}`
    : null;

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for browsers without clipboard API
      const el = document.createElement('textarea');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-900 border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-light text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-400" />
            Share Track
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {loop && (
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-white font-medium text-sm">{loop.name || 'AI Generated Loop'}</p>
              {loop.bpm && (
                <p className="text-white/50 text-xs mt-1">{loop.bpm} BPM · {loop.mood || ''}</p>
              )}
            </div>
          )}

          {shareUrl ? (
            <>
              <div>
                <label className="block text-sm text-white/70 mb-2">Share link</label>
                <div className="flex gap-2">
                  <div className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 text-sm truncate">
                    {shareUrl}
                  </div>
                  <Button
                    onClick={handleCopy}
                    className={`shrink-0 px-3 ${
                      copied
                        ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                        : 'bg-purple-500/20 border border-purple-500/50 text-purple-300 hover:bg-purple-500/30'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <p className="text-center text-xs text-white/40">
                Anyone with this link can listen and leave feedback
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-white/50 text-sm mt-2">Generating share link…</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
