import React, { useState, useEffect } from 'react';
import { ArenaProfile, ArenaLanguage, Racer } from '../../types/arenaTypes';
import { DAILY_CHALLENGE_TEXTS, MOCK_GLOBAL_LEADERBOARD } from '../../data/arenaData';
import {
  Calendar,
  Clock,
  Trophy,
  Zap,
  Flame,
  Award,
  Play,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface DailyChallengeViewProps {
  profile: ArenaProfile;
  language: ArenaLanguage;
  onStartDailyRace: (text: string) => void;
  onBack: () => void;
}

export const DailyChallengeView: React.FC<DailyChallengeViewProps> = ({
  profile,
  language,
  onStartDailyRace,
  onBack
}) => {
  // Compute remaining time until midnight UTC
  const [timeRemaining, setTimeRemaining] = useState<string>('18:42:15');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
      const diffMs = Math.max(0, nextMidnight.getTime() - now.getTime());

      const hours = Math.floor(diffMs / 3600000);
      const mins = Math.floor((diffMs % 3600000) / 60000);
      const secs = Math.floor((diffMs % 60000) / 1000);

      setTimeRemaining(
        `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const dailyPool = DAILY_CHALLENGE_TEXTS[language] || DAILY_CHALLENGE_TEXTS.english;
  // Deterministic daily text based on day of month
  const dayIndex = new Date().getDate() % dailyPool.length;
  const todayText = dailyPool[dayIndex];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/50 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 text-xs font-bold font-mono">
            <Calendar className="w-3.5 h-3.5" />
            <span>DAILY ARENA SPRINT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Today's Global Challenge
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            A single synchronized text for every typist worldwide today. Compete for daily leaderboard rank and streak multipliers.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-2xl">
          <Clock className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Resets in</span>
            <span className="text-sm font-mono font-black text-amber-300">
              {timeRemaining}
            </span>
          </div>
        </div>
      </div>

      {/* Today's Stats & Text Preview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Daily Streak</span>
            <div className="flex items-center justify-center gap-1 text-amber-400 font-mono font-black text-xl">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{profile.streakDays || 1} Days</span>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Your Best Today</span>
            <span className="text-xl font-black text-blue-400 font-mono">
              {profile.records.bestDailyChallengeWpm > 0 ? `${profile.records.bestDailyChallengeWpm} WPM` : 'Not Played'}
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Global Leader</span>
            <span className="text-xl font-black text-yellow-400 font-mono">
              92 WPM
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Global Rank</span>
            <span className="text-xl font-black text-indigo-300 font-mono">
              #18
            </span>
          </div>
        </div>

        {/* Text Preview Box */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase block mb-2">
            Today's Target Passage Preview
          </span>
          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed italic select-none">
            "{todayText}"
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            Back to Arena Hub
          </button>

          <button
            onClick={() => onStartDailyRace(todayText)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-all cursor-pointer shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Race Daily Challenge</span>
          </button>
        </div>
      </div>
    </div>
  );
};
