import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Sparkles, RefreshCw } from 'lucide-react';
import { shareApi } from '../services/api';

const CACHE_KEY = 'marjam_daily_summary';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const DailySummaryPanel = () => {
  const [summary, setSummary] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async (force = false) => {
    // Use cached data unless forcing a refresh
    if (!force) {
      try {
        const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
        if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
          setSummary(cached.data);
          return;
        }
      } catch {
        // ignore parse errors
      }
    }

    setLoading(true);
    setError('');
    try {
      const data = await shareApi.getDailySummary();
      if (data.success) {
        setSummary(data);
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, fetchedAt: Date.now() }));
      } else {
        setError(data.error || 'No summary available yet');
      }
    } catch (err) {
      setError('Could not load summary');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = (e) => {
    e.stopPropagation();
    sessionStorage.removeItem(CACHE_KEY);
    loadSummary(true);
  };

  if (error && !summary) return null; // hide if nothing to show

  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/20 border border-purple-500/20 rounded-xl overflow-hidden">
        {/* Header — always visible */}
        <button
          onClick={() => setExpanded(prev => !prev)}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-white font-medium text-sm">Today's Community Pulse</span>
            {summary?.stats && (
              <span className="text-white/40 text-xs">
                · {summary.stats.generations} generated · {summary.stats.shared_tracks} shared
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!loading && (
              <button
                onClick={handleRefresh}
                className="text-white/40 hover:text-white/70 transition-colors p-1"
                title="Refresh summary"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            )}
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-white/50" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/50" />
            )}
          </div>
        </button>

        {/* Expandable body */}
        {expanded && (
          <div className="px-4 pb-4">
            <div className="border-t border-white/10 pt-3">
              {loading ? (
                <div className="flex items-center gap-2 py-2">
                  <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-white/50 text-sm">Generating today's summary…</span>
                </div>
              ) : summary?.summary ? (
                <>
                  <p className="text-white/80 text-sm leading-relaxed">{summary.summary}</p>
                  {summary.stats && (
                    <div className="flex gap-4 mt-3">
                      <Stat label="Generated" value={summary.stats.generations} />
                      <Stat label="Shared" value={summary.stats.shared_tracks} />
                      <Stat label="Feedbacks" value={summary.stats.feedbacks} />
                    </div>
                  )}
                  {summary.date && (
                    <p className="text-white/30 text-xs mt-3">{summary.date}</p>
                  )}
                </>
              ) : (
                <p className="text-white/40 text-sm py-2">
                  No summary available yet — generate and share some tracks!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="text-center">
    <p className="text-purple-300 font-semibold text-lg leading-none">{value ?? 0}</p>
    <p className="text-white/40 text-xs mt-0.5">{label}</p>
  </div>
);

export default DailySummaryPanel;
