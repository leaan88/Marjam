import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Pause, Square, MessageSquare, Star, Music, ArrowLeft } from 'lucide-react';
import { shareApi } from '../services/api';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../context/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const SharedTrackPage = () => {
  const { token } = useParams();
  const { isAuthenticated } = useAuth();

  const [track, setTrack] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isPlaying, setIsPlaying] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    loadTrack();
  }, [token]);

  const loadTrack = async () => {
    setLoading(true);
    try {
      const data = await shareApi.getSharedTrack(token);
      if (data.success) {
        setTrack(data.track);
        setFeedbacks(data.feedbacks || []);
      } else {
        setError('Track not found');
      }
    } catch {
      setError('Failed to load track');
    } finally {
      setLoading(false);
    }
  };

  const resolveAudioUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `${BACKEND_URL}${url}`;
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
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

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) return;
    setSubmitting(true);
    try {
      await shareApi.submitFeedback(token, {
        text: feedbackText.trim(),
        rating: rating || null,
      });
      setFeedbacks(prev => [
        { id: Date.now(), text: feedbackText.trim(), rating, created_at: new Date().toISOString() },
        ...prev,
      ]);
      setFeedbackText('');
      setRating(0);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch {
      // silent fail — feedback is best-effort
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !track) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Music className="w-12 h-12 text-white/20" />
        <p className="text-white/60 text-lg">{error || 'Track not found'}</p>
        <Link to="/" className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Marjam
        </Link>
      </div>
    );
  }

  const audioUrl = resolveAudioUrl(track.audio_url);

  return (
    <div className="min-h-screen bg-black text-white">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onError={() => setIsPlaying(false)}
        />
      )}

      {/* Header */}
      <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Marjam
        </Link>
        <span className="text-white/30 text-xs">Shared Track</span>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-8">
        {/* Track Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold text-white truncate">
                {track.prompt?.slice(0, 60) || 'AI Generated Loop'}
                {track.prompt?.length > 60 ? '…' : ''}
              </h1>
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-white/50">
                {track.bpm && <span>{track.bpm} BPM</span>}
                {track.mood && <span className="capitalize">{track.mood}</span>}
                {track.loop_type && <span className="capitalize">{track.loop_type}</span>}
                {track.provider && <span className="text-purple-400/60">{track.provider}</span>}
              </div>
            </div>
          </div>

          {/* Player Controls */}
          {audioUrl ? (
            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={handlePlayPause}
                className="w-12 h-12 rounded-full bg-purple-500 hover:bg-purple-600 flex items-center justify-center transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <button
                onClick={handleStop}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Square className="w-4 h-4" />
              </button>
              <span className="text-white/40 text-xs">
                {isPlaying ? 'Playing…' : 'Press play to listen'}
              </span>
            </div>
          ) : (
            <p className="mt-4 text-white/40 text-sm">Audio not available</p>
          )}
        </div>

        {/* Feedback Form */}
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-white font-medium">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            Leave Feedback
          </h2>

          {!isAuthenticated && (
            <p className="text-white/40 text-sm">
              <Link to="/" className="text-purple-400 hover:underline">Sign in</Link> to leave feedback, or submit anonymously below.
            </p>
          )}

          {/* Star Rating */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star === rating ? 0 : star)}
                className={`text-xl transition-colors ${
                  star <= rating ? 'text-yellow-400' : 'text-white/20 hover:text-yellow-400/60'
                }`}
              >
                <Star className="w-5 h-5" fill={star <= rating ? 'currentColor' : 'none'} />
              </button>
            ))}
            {rating > 0 && (
              <span className="text-white/40 text-sm self-center ml-1">{rating}/5</span>
            )}
          </div>

          <Textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="What do you think? Great groove, needs more bass, perfect for a lo-fi set…"
            className="bg-white/5 border-white/10 text-white placeholder-white/30 min-h-[80px]"
            disabled={submitting}
          />

          {submitSuccess && (
            <p className="text-green-400 text-sm">Feedback submitted!</p>
          )}

          <Button
            onClick={handleSubmitFeedback}
            disabled={submitting || !feedbackText.trim()}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            {submitting ? 'Sending…' : 'Submit Feedback'}
          </Button>
        </div>

        {/* Existing Feedbacks */}
        {feedbacks.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-white font-medium">
              Community Feedback ({feedbacks.length})
            </h2>
            {feedbacks.map((fb) => (
              <div key={fb.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                {fb.rating > 0 && (
                  <div className="flex gap-0.5 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${s <= fb.rating ? 'text-yellow-400' : 'text-white/20'}`}
                        fill={s <= fb.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                )}
                <p className="text-white/80 text-sm">{fb.text}</p>
                <p className="text-white/30 text-xs mt-1">
                  {new Date(fb.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SharedTrackPage;
