import React, { useState, useEffect, useRef } from 'react';
import { Wand2, Upload, Database, Crown, Music } from 'lucide-react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import MoodParameters from '../components/Scenarios';
import LoopSection from '../components/SoundscapeSection';
import Player from '../components/Player';
import LoginModal from '../components/LoginModal';
import PremiumModal from '../components/PremiumModal';
import DownloadModal from '../components/DownloadModal';
import GenerateModal from '../components/GenerateModal';
import UploadModal from '../components/UploadModal';
import CoreUploadModal from '../components/CoreUploadModal';
import ShareModal from '../components/ShareModal';
import DailySummaryPanel from '../components/DailySummaryPanel';
import { moodParameters } from '../data/mock';
import { samplesApi, shareApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const HomePage = () => {
  const { user, isAuthenticated, isAdmin, isPremium, canDownload, limits, loading } = useAuth();
  
  const [currentLoop, setCurrentLoop] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showCoreUpload, setShowCoreUpload] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareToken, setShareToken] = useState('');
  const [selectedFeature, setSelectedFeature] = useState('');
  const [selectedLoop, setSelectedLoop] = useState(null);
  const [activeMoods, setActiveMoods] = useState([1, 2, 3, 4]); // Free moods
  
  // Samples
  const [uploadedSamples, setUploadedSamples] = useState([]);
  const [coreSamples, setCoreSamples] = useState([]);
  const [generatedLoops, setGeneratedLoops] = useState([]);
  
  const audioRef = useRef(null);

  // Load core samples on mount
  useEffect(() => {
    loadCoreSamples();
    if (isAuthenticated) {
      loadSamples();
    }
  }, [isAuthenticated]);

  const loadSamples = async () => {
    try {
      const data = await samplesApi.getSamples();
      const loops = data.samples.map(sample => ({
        id: sample.id,
        name: sample.name,
        icon: getIconForType(sample.loop_type),
        bpm: sample.bpm,
        locked: false,
        audio_url: samplesApi.getAudioUrl(sample.audio_url),
        mood: sample.mood,
        loop_type: sample.loop_type,
        isUploaded: true
      }));
      setUploadedSamples(loops);
    } catch (err) {
      console.error('Failed to load samples:', err);
    }
  };

  const loadCoreSamples = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/core-samples`);
      const data = await response.json();
      const loops = (data.core_samples || []).map(sample => ({
        id: sample.id,
        name: sample.name,
        icon: getIconForType(sample.loop_type),
        bpm: sample.bpm,
        locked: false,
        audio_url: `${BACKEND_URL}${sample.audio_url}`,
        mood: sample.mood,
        loop_type: sample.loop_type,
        category: sample.category,
        tags: sample.tags,
        key: sample.key,
        isCore: true
      }));
      setCoreSamples(loops);
      
      // Set first core sample as current
      if (loops.length > 0 && !currentLoop) {
        setCurrentLoop({ ...loops[0], section: 'Core Library', bars: 8 });
      }
    } catch (err) {
      console.error('Failed to load core samples:', err);
    }
  };

  const getIconForType = (type) => {
    const iconMap = {
      'drums': 'drums',
      'bass': 'subbass',
      'synth': 'pad',
      'lead': 'lead',
      'fx': 'riser',
      'full': 'fullkit',
      'percussion': 'percussion',
      'vocals': 'lead'
    };
    return iconMap[type] || 'drums';
  };

  // Check if mood is available for current user tier
  const isMoodAvailable = (mood) => {
    if (!isAuthenticated) {
      return mood.tier === 'free';
    }
    if (isAdmin()) return true;
    if (isPremium()) return mood.tier !== 'admin';
    return mood.tier === 'free';
  };

  const handlePlay = (loop, section) => {
    if (loop.audio_url) {
      if (audioRef.current) {
        audioRef.current.src = loop.audio_url;
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
    
    setCurrentLoop({ ...loop, section, bars: 8 });
    setIsPlaying(true);
  };

  const handleDownload = (loop) => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }
    if (!canDownload()) {
      setSelectedFeature('Download');
      setShowPremium(true);
      return;
    }
    setSelectedLoop(loop);
    setShowDownload(true);
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const handleMoodClick = (mood) => {
    if (!isMoodAvailable(mood)) {
      if (!isAuthenticated) {
        setShowLogin(true);
      } else {
        setSelectedFeature(mood.name + ' mood');
        setShowPremium(true);
      }
    }
  };

  const handleToggleMood = (moodId) => {
    const mood = moodParameters.find(m => m.id === moodId);
    if (!isMoodAvailable(mood)) {
      if (!isAuthenticated) {
        setShowLogin(true);
      } else {
        setSelectedFeature(mood.name + ' mood');
        setShowPremium(true);
      }
      return;
    }
    setActiveMoods(prev => 
      prev.includes(moodId) 
        ? prev.filter(id => id !== moodId)
        : [...prev, moodId]
    );
  };

  const handleGenerate = () => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }
    if (limits?.ai_providers?.length === 0) {
      setSelectedFeature('AI Generation');
      setShowPremium(true);
      return;
    }
    setShowGenerate(true);
  };

  const handleUpload = () => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }
    setShowUpload(true);
  };

  const handleGenerated = (result) => {
    const newLoop = {
      id: result.generation_id || Date.now(),
      name: result.prompt?.slice(0, 30) + '...' || 'AI Generated',
      icon: getIconForType(result.loop_type),
      bpm: result.bpm || 120,
      locked: false,
      audio_url: result.audio_url,
      provider: result.provider,
      mood: result.mood,
      isGenerated: true
    };
    
    setGeneratedLoops(prev => [newLoop, ...prev]);
    
    if (result.audio_url) {
      setCurrentLoop({ ...newLoop, section: 'AI Generated', bars: 8 });
      if (audioRef.current) {
        audioRef.current.src = result.audio_url;
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  const handleShare = async (loop) => {
    if (!loop.id || !loop.isGenerated) return;
    setSelectedLoop(loop);
    setShareToken('');
    setShowShare(true);
    try {
      const result = await shareApi.shareTrack(loop.id);
      if (result.success) setShareToken(result.token);
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const handleUploaded = (sample) => {
    const newLoop = {
      id: sample.id,
      name: sample.name,
      icon: getIconForType(sample.loop_type),
      bpm: sample.bpm,
      locked: false,
      audio_url: samplesApi.getAudioUrl(sample.audio_url),
      mood: sample.mood,
      loop_type: sample.loop_type,
      isUploaded: true
    };
    
    setUploadedSamples(prev => [newLoop, ...prev]);
    
    setCurrentLoop({ ...newLoop, section: 'My Samples', bars: 8 });
    if (audioRef.current) {
      audioRef.current.src = newLoop.audio_url;
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleCoreUploaded = (sample) => {
    const newLoop = {
      id: sample.id,
      name: sample.name,
      icon: getIconForType(sample.loop_type),
      bpm: sample.bpm,
      locked: false,
      audio_url: `${BACKEND_URL}${sample.audio_url}`,
      mood: sample.mood,
      loop_type: sample.loop_type,
      category: sample.category,
      tags: sample.tags,
      isCore: true
    };
    
    setCoreSamples(prev => [newLoop, ...prev]);
    
    setCurrentLoop({ ...newLoop, section: 'Core Library', bars: 8 });
    if (audioRef.current) {
      audioRef.current.src = newLoop.audio_url;
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleDeleteSample = async (loop) => {
    if (!loop.isUploaded) return;
    
    try {
      await samplesApi.deleteSample(loop.id);
      setUploadedSamples(prev => prev.filter(s => s.id !== loop.id));
      
      if (currentLoop?.id === loop.id) {
        handleStop();
      }
    } catch (err) {
      console.error('Failed to delete sample:', err);
    }
  };

  const getActiveMoodNames = () => {
    return activeMoods
      .map(id => moodParameters.find(m => m.id === id)?.name?.toLowerCase())
      .filter(Boolean);
  };

  // Get mood parameters with proper lock state based on user tier
  const getMoodsWithAccess = () => {
    return moodParameters.map(mood => ({
      ...mood,
      locked: !isMoodAvailable(mood)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header onSignInClick={() => setShowLogin(true)} />
      
      <audio 
        ref={audioRef} 
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />
      
      <main className="pt-24 pb-32 px-6">
        <Banner />
        
        {/* Tier Info Banner */}
        {isAuthenticated && (
          <div className="w-full max-w-3xl mx-auto mt-6">
            <div className={`p-4 rounded-xl border ${
              isAdmin() ? 'bg-red-500/10 border-red-500/30' :
              isPremium() ? 'bg-yellow-500/10 border-yellow-500/30' :
              'bg-green-500/10 border-green-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Crown className={`w-5 h-5 ${
                    isAdmin() ? 'text-red-400' :
                    isPremium() ? 'text-yellow-400' :
                    'text-green-400'
                  }`} />
                  <div>
                    <p className="text-white font-medium">
                      {isAdmin() ? 'Admin Access' : isPremium() ? 'Premium Plan' : 'Free Plan'}
                    </p>
                    <p className="text-white/50 text-sm">
                      {isAdmin() ? 'Unlimited access to all features' :
                       isPremium() ? `${limits?.max_generations || 0} AI generations • ${limits?.max_uploads || 0} uploads` :
                       `${limits?.max_generations || 0} AI generations • ${limits?.max_uploads || 0} uploads`}
                    </p>
                  </div>
                </div>
                {!isPremium() && !isAdmin() && (
                  <Button
                    onClick={() => setShowPremium(true)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-medium text-sm"
                  >
                    Upgrade
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="w-full max-w-3xl mx-auto mt-6 flex gap-3 flex-wrap">
          <Button
            onClick={handleGenerate}
            className={`flex-1 min-w-[140px] py-4 text-white font-medium text-sm rounded-xl ${
              isAuthenticated && limits?.ai_providers?.length > 0
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                : 'bg-white/10 hover:bg-white/20 border border-white/10'
            }`}
          >
            <Wand2 className="w-4 h-4 mr-2" />
            {!isAuthenticated ? 'Sign in to Generate' : 
             limits?.ai_providers?.length === 0 ? 'Upgrade for AI' : 'Generate AI'}
          </Button>
          <Button
            onClick={handleUpload}
            className="flex-1 min-w-[140px] py-4 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl border border-white/10"
          >
            <Upload className="w-4 h-4 mr-2" />
            {!isAuthenticated ? 'Sign in to Upload' : 'Upload'}
          </Button>
          {isAdmin() && (
            <Button
              onClick={() => setShowCoreUpload(true)}
              className="flex-1 min-w-[140px] py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium text-sm rounded-xl"
            >
              <Database className="w-4 h-4 mr-2" />
              Core Upload
            </Button>
          )}
        </div>
        
        <DailySummaryPanel />

        <MoodParameters
          onMoodClick={handleMoodClick}
          activeMoods={activeMoods}
          onToggleMood={handleToggleMood}
          moods={getMoodsWithAccess()}
        />
        
        {/* Core Samples Library - Always visible */}
        {coreSamples.length > 0 && (
          <LoopSection 
            title="🎹 Core Library" 
            loops={coreSamples}
            onPlay={(loop) => handlePlay(loop, 'Core Library')}
            onDownload={handleDownload}
            currentPlaying={currentLoop}
          />
        )}
        
        {/* User's uploaded samples - only if authenticated */}
        {isAuthenticated && uploadedSamples.length > 0 && (
          <LoopSection 
            title="📁 My Samples" 
            loops={uploadedSamples}
            onPlay={(loop) => handlePlay(loop, 'My Samples')}
            onDownload={handleDownload}
            onDelete={handleDeleteSample}
            currentPlaying={currentLoop}
          />
        )}
        
        {/* AI Generated - only if authenticated and has generations */}
        {isAuthenticated && generatedLoops.length > 0 && (
          <LoopSection
            title="🎵 AI Generated"
            loops={generatedLoops}
            onPlay={(loop) => handlePlay(loop, 'AI Generated')}
            onDownload={handleDownload}
            onShare={handleShare}
            currentPlaying={currentLoop}
          />
        )}
      </main>
      
      {/* Bottom Player */}
      {currentLoop && (
        <Player 
          currentLoop={currentLoop}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onStop={handleStop}
        />
      )}
      
      {/* Modals */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <PremiumModal 
        isOpen={showPremium} 
        onClose={() => setShowPremium(false)} 
        featureName={selectedFeature}
      />
      <DownloadModal
        isOpen={showDownload}
        onClose={() => setShowDownload(false)}
        loop={selectedLoop}
      />
      <GenerateModal
        isOpen={showGenerate}
        onClose={() => setShowGenerate(false)}
        onGenerated={handleGenerated}
        activeMoods={getActiveMoodNames()}
      />
      <UploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUploaded={handleUploaded}
      />
      <CoreUploadModal
        isOpen={showCoreUpload}
        onClose={() => setShowCoreUpload(false)}
        onUploaded={handleCoreUploaded}
      />
      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        loop={selectedLoop}
        shareToken={shareToken}
      />
    </div>
  );
};

export default HomePage;
