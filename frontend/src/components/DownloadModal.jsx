import React, { useState } from 'react';
import { Download, Check, Music2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

const DownloadModal = ({ isOpen, onClose, loop }) => {
  const [selectedBars, setSelectedBars] = useState(8);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  
  const barOptions = [
    { bars: 8, label: '8 bars', duration: '~4 sec' },
    { bars: 16, label: '16 bars', duration: '~8 sec' },
    { bars: 32, label: '32 bars', duration: '~16 sec' }
  ];
  
  const handleDownload = () => {
    setDownloading(true);
    // Simulate download
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      setTimeout(() => {
        setDownloaded(false);
        onClose();
      }, 1500);
    }, 2000);
  };

  if (!loop) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-900 border-white/10 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-light text-white text-center">
            Download Loop
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {/* Loop Info */}
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Music2 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-white font-medium">{loop.name}</p>
              <p className="text-white/50 text-sm">{loop.bpm} BPM</p>
            </div>
          </div>
          
          {/* Bar Length Selection */}
          <p className="text-white/60 text-sm mb-3">Select loop length:</p>
          <div className="space-y-2 mb-6">
            {barOptions.map((option) => (
              <button
                key={option.bars}
                onClick={() => setSelectedBars(option.bars)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                  selectedBars === option.bars
                    ? 'bg-purple-500/20 border-purple-500/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedBars === option.bars
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-white/30'
                  }`}>
                    {selectedBars === option.bars && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-white font-medium">{option.label}</span>
                </div>
                <span className="text-white/40 text-sm">{option.duration}</span>
              </button>
            ))}
          </div>
          
          {/* Format Info */}
          <div className="flex items-center justify-between text-sm text-white/40 mb-4 px-1">
            <span>Format: WAV 44.1kHz</span>
            <span>~{(selectedBars * 0.3).toFixed(1)} MB</span>
          </div>
          
          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={downloading || downloaded}
            className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              downloaded
                ? 'bg-green-500 text-white'
                : downloading
                ? 'bg-purple-500/50 text-white/70 cursor-wait'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
            }`}
          >
            {downloaded ? (
              <>
                <Check className="w-5 h-5" />
                Downloaded!
              </>
            ) : downloading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download {selectedBars} Bar Loop
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadModal;
