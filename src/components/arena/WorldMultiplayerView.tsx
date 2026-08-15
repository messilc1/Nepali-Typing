import React, { useState, useEffect } from 'react';
import { ArenaProfile, ArenaLanguage, Racer } from '../../types/arenaTypes';
import { QUICK_RACE_TEXTS } from '../../data/arenaData';
import {
  Globe,
  Users,
  Zap,
  Play,
  RotateCcw,
  ShieldCheck,
  Award,
  Search,
  Radio,
  CheckCircle2
} from 'lucide-react';

interface WorldMultiplayerViewProps {
  profile: ArenaProfile;
  language: ArenaLanguage;
  isRanked?: boolean;
  onLaunchMatch: (config: {
    opponents: Racer[];
    text: string;
    raceTitle: string;
  }) => void;
  onBack: () => void;
}

export const WorldMultiplayerView: React.FC<WorldMultiplayerViewProps> = ({
  profile,
  language,
  isRanked = false,
  onLaunchMatch,
  onBack
}) => {
  const [matchmakingState, setMatchmakingState] = useState<'idle' | 'searching' | 'found'>('idle');
  const [queueElapsedSec, setQueueElapsedSec] = useState<number>(0);
  const [foundOpponent, setFoundOpponent] = useState<Racer | null>(null);

  // Matchmaking ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (matchmakingState === 'searching') {
      setQueueElapsedSec(0);
      interval = setInterval(() => {
        setQueueElapsedSec((prev) => prev + 1);
      }, 1000);

      // Simulate realistic match finding after 2.5 - 4 seconds
      const findTimeout = setTimeout(() => {
        // Generate a matched player with similar rating and WPM
        const opponentRating = Math.max(800, profile.rating + Math.round((Math.random() - 0.45) * 80));
        const opponentWpm = Math.max(25, (profile.records.highestWpmEnglish || 55) + Math.round((Math.random() - 0.45) * 8));

        const namesPool = [
          'Aayush_Karki_NP',
          'Pooja_Kathmandu',
          'CyberTypist_99',
          'PokharaRacer',
          'Devon_WPM',
          'Sita_Gautam',
          'ApexRunner'
        ];
        const randomName = namesPool[Math.floor(Math.random() * namesPool.length)];
        const avatarPool = ['🏎️', '🚀', '⚡', '🦅', '🔥', '👑'];
        const randomAvatar = avatarPool[Math.floor(Math.random() * avatarPool.length)];

        const matched: Racer = {
          id: `world-opp-${Date.now()}`,
          name: randomName,
          avatar: randomAvatar,
          isPlayer: false,
          isAi: true, // Powered by realistic simulation
          wpm: opponentWpm,
          rating: opponentRating,
          currentProgress: 0,
          position: 2,
          status: 'ready'
        };

        setFoundOpponent(matched);
        setMatchmakingState('found');
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(findTimeout);
      };
    }
  }, [matchmakingState, profile.rating, profile.records.highestWpmEnglish]);

  const handleStartSearching = () => {
    setMatchmakingState('searching');
  };

  const handleCancelSearch = () => {
    setMatchmakingState('idle');
    setFoundOpponent(null);
  };

  const handleLaunchFoundMatch = () => {
    if (!foundOpponent) return;

    const samplePool = QUICK_RACE_TEXTS[language] || QUICK_RACE_TEXTS.english;
    const selectedText = samplePool[Math.floor(Math.random() * samplePool.length)];

    onLaunchMatch({
      opponents: [foundOpponent],
      text: selectedText,
      raceTitle: `${isRanked ? 'Competitive Ranked 1v1' : 'World Match'} vs ${foundOpponent.name}`
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/40 rounded-full text-blue-300 text-xs font-bold font-mono">
            <Globe className="w-3.5 h-3.5" />
            <span>{isRanked ? 'COMPETITIVE RANKED ARENA' : 'WORLDWIDE MULTIPLAYER'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isRanked ? 'Official Competitive Rating Match' : 'Play With Anyone Worldwide'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Match with live typists near your skill tier ({profile.tier} {profile.division} &bull; Rating: {profile.rating}). Gain MMR and climb the weekly leagues.
          </p>
        </div>
      </div>

      {/* Matchmaking Lobby Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-slate-200">
        {matchmakingState === 'idle' && (
          <div className="space-y-6 text-center py-6">
            <div className="w-20 h-20 rounded-3xl bg-blue-950/80 border border-blue-800 mx-auto flex items-center justify-center text-4xl shadow-xl shadow-blue-950/50">
              <Globe className="w-10 h-10 text-blue-400 animate-spin-slow" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Find Random Opponent
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                The matchmaking system pairs you with someone of similar WPM and accuracy in {language === 'nepali' ? 'Nepali Romanized' : 'English'}.
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 py-2 font-mono text-xs">
              <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl">
                <span className="text-slate-500 block">YOUR RATING</span>
                <strong className="text-indigo-300 font-bold text-sm">{profile.rating} MMR</strong>
              </div>
              <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl">
                <span className="text-slate-500 block">CURRENT RANK</span>
                <strong className="text-blue-400 font-bold text-sm">{profile.tier} {profile.division}</strong>
              </div>
              <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl">
                <span className="text-slate-500 block">LANGUAGE</span>
                <strong className="text-emerald-400 font-bold text-sm uppercase">{language}</strong>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={onBack}
                className="px-5 py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                Back to Arena Hub
              </button>

              <button
                onClick={handleStartSearching}
                className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition-all cursor-pointer shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Find Match Now</span>
              </button>
            </div>
          </div>
        )}

        {matchmakingState === 'searching' && (
          <div className="space-y-6 text-center py-10">
            <div className="w-20 h-20 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mx-auto flex items-center justify-center">
              <Radio className="w-8 h-8 text-blue-400 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white">Searching for Opponent...</h3>
              <p className="text-xs text-slate-400 font-mono">
                Matching player pool ({queueElapsedSec}s in queue)
              </p>
            </div>

            <button
              onClick={handleCancelSearch}
              className="px-6 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel Matchmaking
            </button>
          </div>
        )}

        {matchmakingState === 'found' && foundOpponent && (
          <div className="space-y-6 text-center py-6 animate-in zoom-in-95">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-emerald-300 text-xs font-bold font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>MATCH FOUND &mdash; READY FOR BATTLE</span>
            </div>

            {/* Vs Display Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 max-w-lg mx-auto">
              {/* You */}
              <div className="bg-slate-950 border border-blue-600/60 rounded-2xl p-4 text-center">
                <span className="text-3xl block mb-1">{profile.selectedAvatar || '🏎️'}</span>
                <h4 className="text-sm font-black text-blue-300">You</h4>
                <span className="text-xs font-mono text-slate-400 block">{profile.rating} MMR</span>
              </div>

              {/* VS Banner */}
              <div className="text-center font-black font-mono text-2xl text-amber-400">
                VS
              </div>

              {/* Opponent */}
              <div className="bg-slate-950 border border-rose-600/60 rounded-2xl p-4 text-center">
                <span className="text-3xl block mb-1">{foundOpponent.avatar}</span>
                <h4 className="text-sm font-black text-rose-300 truncate">{foundOpponent.name}</h4>
                <span className="text-xs font-mono text-slate-400 block">{foundOpponent.rating} MMR</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleLaunchFoundMatch}
                className="px-10 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-base transition-all cursor-pointer shadow-xl shadow-blue-600/40 inline-flex items-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Enter Arena Track (3..2..1..GO)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
