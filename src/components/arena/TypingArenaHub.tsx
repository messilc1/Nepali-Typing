import React, { useState, useEffect } from 'react';
import {
  ArenaProfile,
  ArenaLanguage,
  ArenaGameMode,
  Racer,
  CareerStage,
  BossChallenge
} from '../../types/arenaTypes';
import {
  INITIAL_ARENA_PROFILE,
  CAREER_LEVELS,
  BOSS_CHALLENGES,
  BOT_ARCHETYPES,
  QUICK_RACE_TEXTS,
  getTierFromRating,
  calculateXpForNextLevel,
  AVATAR_OPTIONS,
  TITLE_OPTIONS
} from '../../data/arenaData';
import { ArenaTypingEngine } from './ArenaTypingEngine';
import { RaceResultsModal } from './RaceResultsModal';
import { CareerModeView } from './CareerModeView';
import { BossChallengesView } from './BossChallengesView';
import { AiBattleView } from './AiBattleView';
import { DailyChallengeView } from './DailyChallengeView';
import { WeaknessArenaView } from './WeaknessArenaView';
import { LocalMultiplayerView } from './LocalMultiplayerView';
import { WorldMultiplayerView } from './WorldMultiplayerView';
import { FriendsMultiplayerView } from './FriendsMultiplayerView';
import { TournamentView } from './TournamentView';
import { ArenaLeaderboardView } from './ArenaLeaderboardView';
import { AchievementsView } from './AchievementsView';
import { MyRecordsView } from './MyRecordsView';

import {
  Trophy,
  Globe,
  Users,
  Monitor,
  Calendar,
  Skull,
  Target,
  Bot,
  Play,
  Flame,
  Zap,
  Award,
  Crown,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Star,
  Settings
} from 'lucide-react';

interface TypingArenaHubProps {
  liveKeyStatsMap?: Record<string, { totalHits: number; errors: number; totalDurationMs: number }>;
}

export const TypingArenaHub: React.FC<TypingArenaHubProps> = ({ liveKeyStatsMap = {} }) => {
  // Arena Language Mode
  const [language, setLanguage] = useState<ArenaLanguage>('nepali');

  // Persistent Profile
  const [profile, setProfile] = useState<ArenaProfile>(() => {
    try {
      const saved = localStorage.getItem('ntp_arena_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_ARENA_PROFILE, ...parsed };
      }
    } catch {}
    return INITIAL_ARENA_PROFILE;
  });

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('ntp_arena_profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  // Current Active Sub-View in Arena
  const [currentView, setCurrentView] = useState<
    | 'hub'
    | 'career'
    | 'ai-battle'
    | 'daily'
    | 'boss'
    | 'weakness'
    | 'local-multiplayer'
    | 'world-multiplayer'
    | 'ranked-multiplayer'
    | 'friends'
    | 'tournament'
    | 'leaderboards'
    | 'achievements'
    | 'records'
    | 'racing'
  >('hub');

  // Active Race Configuration
  const [activeRaceConfig, setActiveRaceConfig] = useState<{
    text: string;
    opponents: Racer[];
    raceTitle: string;
    stageId?: string;
    bossId?: string;
    isRanked?: boolean;
    isDaily?: boolean;
  } | null>(null);

  // Post Race Results Modal State
  const [raceResultsData, setRaceResultsData] = useState<{
    userRacer: Racer;
    allRacers: Racer[];
    userPlace: number;
    xpEarned: number;
    ratingDelta: number;
    mistypedKeys: Record<string, number>;
    mistypedWords: Record<string, number>;
    wpmHistory: { second: number; wpm: number; errors: number }[];
    isNewPersonalBest: boolean;
  } | null>(null);

  // Launch Quick Race
  const handleQuickRace = () => {
    const samplePool = QUICK_RACE_TEXTS[language] || QUICK_RACE_TEXTS.english;
    const selectedText = samplePool[Math.floor(Math.random() * samplePool.length)];

    const bot1 = BOT_ARCHETYPES[1];
    const bot2 = BOT_ARCHETYPES[2];
    const bot3 = BOT_ARCHETYPES[3];

    const opponents: Racer[] = [
      { id: 'b1', name: bot1.name, avatar: bot1.avatar, isPlayer: false, isAi: true, wpm: 34, currentProgress: 0, position: 2, status: 'ready' },
      { id: 'b2', name: bot2.name, avatar: bot2.avatar, isPlayer: false, isAi: true, wpm: 46, currentProgress: 0, position: 3, status: 'ready' },
      { id: 'b3', name: bot3.name, avatar: bot3.avatar, isPlayer: false, isAi: true, wpm: 58, currentProgress: 0, position: 4, status: 'ready' }
    ];

    setActiveRaceConfig({
      text: selectedText,
      opponents,
      raceTitle: 'Quick Race (4 Competitors)'
    });
    setCurrentView('racing');
  };

  // Launch Career Stage Race
  const handleStartCareerStage = (stage: CareerStage) => {
    const text = language === 'nepali' ? stage.textNepali : stage.textEnglish;
    const botWpm = Math.max(20, stage.targetWpm - 4);
    const opponents: Racer[] = [
      {
        id: `career-bot-${stage.id}`,
        name: `Pacing Bot (${stage.targetWpm} WPM)`,
        avatar: '🤖',
        isPlayer: false,
        isAi: true,
        wpm: botWpm,
        currentProgress: 0,
        position: 2,
        status: 'ready'
      }
    ];

    setActiveRaceConfig({
      text,
      opponents,
      raceTitle: `Career Stage ${stage.stageNumber}: ${stage.title}`,
      stageId: stage.id
    });
    setCurrentView('racing');
  };

  // Launch Boss Challenge
  const handleStartBoss = (boss: BossChallenge) => {
    const text = language === 'nepali' ? boss.textNepali : boss.textEnglish;
    const opponents: Racer[] = [
      {
        id: `boss-rival-${boss.id}`,
        name: boss.name,
        avatar: boss.avatarIcon,
        isPlayer: false,
        isAi: true,
        wpm: boss.targetWpm - 2,
        currentProgress: 0,
        position: 2,
        status: 'ready'
      }
    ];

    setActiveRaceConfig({
      text,
      opponents,
      raceTitle: `Boss Gauntlet #${boss.bossNumber}: ${boss.name}`,
      bossId: boss.id
    });
    setCurrentView('racing');
  };

  // Process Completed Race
  const handleFinishRace = (results: {
    userRacer: Racer;
    allRacers: Racer[];
    mistypedKeys: Record<string, number>;
    mistypedWords: Record<string, number>;
    wpmHistory: { second: number; wpm: number; errors: number }[];
    totalKeystrokes: number;
    backspaces: number;
  }) => {
    const userNetWpm = results.userRacer.netWpm || results.userRacer.wpm || 0;
    const userAcc = results.userRacer.accuracy || 100;

    // Calculate position
    const sorted = [...results.allRacers].sort((a, b) => {
      if (a.status === 'finished' && b.status === 'finished') {
        return (a.finishTime || 0) - (b.finishTime || 0);
      }
      if (a.status === 'finished') return -1;
      if (b.status === 'finished') return 1;
      return b.currentProgress - a.currentProgress;
    });
    const userPlace = sorted.findIndex((r) => r.isPlayer) + 1;

    // Calculate XP
    let xpEarned = 150; // Base completion XP
    if (userPlace === 1) xpEarned += 100;
    if (userAcc >= 95) xpEarned += 80;
    if (userAcc >= 99) xpEarned += 150;

    // Check personal best
    let isPb = false;
    if (userNetWpm > (language === 'nepali' ? profile.records.highestWpmNepali : profile.records.highestWpmEnglish)) {
      isPb = true;
      xpEarned += 150;
    }

    // Calculate MMR rating delta
    let ratingDelta = userPlace === 1 ? +24 : userPlace === 2 ? +14 : userPlace === 3 ? +4 : -10;
    if (userAcc >= 98) ratingDelta += 4;
    const newRating = Math.max(500, profile.rating + ratingDelta);
    const { tier: newTier, division: newDiv } = getTierFromRating(newRating);

    // Calculate Level up
    let newXp = profile.xp + xpEarned;
    let newLevel = profile.level;
    let newXpForNext = profile.xpForNextLevel;

    while (newXp >= newXpForNext) {
      newXp -= newXpForNext;
      newLevel += 1;
      newXpForNext = calculateXpForNextLevel(newLevel);
    }

    // Update career stage if relevant
    const updatedCareer = { ...profile.careerProgress };
    if (activeRaceConfig?.stageId) {
      const stage = CAREER_LEVELS.flatMap((l) => l.stages).find((s) => s.id === activeRaceConfig.stageId);
      if (stage && userNetWpm >= stage.targetWpm && userAcc >= stage.targetAccuracy) {
        const stars = userAcc >= 98 && userNetWpm >= stage.targetWpm + 10 ? 3 : userAcc >= 94 ? 2 : 1;
        updatedCareer[stage.id] = {
          completed: true,
          stars,
          bestWpm: Math.max(updatedCareer[stage.id]?.bestWpm || 0, userNetWpm),
          bestAcc: Math.max(updatedCareer[stage.id]?.bestAcc || 0, userAcc)
        };
      }
    }

    // Update boss if relevant
    const updatedBoss = { ...profile.bossDefeated };
    if (activeRaceConfig?.bossId) {
      const boss = BOSS_CHALLENGES.find((b) => b.id === activeRaceConfig.bossId);
      if (boss && userNetWpm >= boss.targetWpm && userAcc >= boss.minAccuracy) {
        updatedBoss[boss.id] = {
          defeated: true,
          bestTime: results.userRacer.finishTime || 0,
          stars: userAcc >= 98 ? 3 : 2
        };
      }
    }

    // Update records
    const updatedRecords = {
      ...profile.records,
      highestWpmNepali: language === 'nepali' ? Math.max(profile.records.highestWpmNepali, userNetWpm) : profile.records.highestWpmNepali,
      highestWpmEnglish: language === 'english' ? Math.max(profile.records.highestWpmEnglish, userNetWpm) : profile.records.highestWpmEnglish,
      highestNetWpm: Math.max(profile.records.highestNetWpm, userNetWpm),
      bestAccuracy: Math.max(profile.records.bestAccuracy, userAcc),
      totalRacesWon: userPlace === 1 ? profile.records.totalRacesWon + 1 : profile.records.totalRacesWon,
      totalWordsTypedInArena: profile.records.totalWordsTypedInArena + Math.round(results.totalKeystrokes / 5)
    };

    // Commit updated profile
    setProfile((prev) => ({
      ...prev,
      level: newLevel,
      xp: newXp,
      xpForNextLevel: newXpForNext,
      totalXp: prev.totalXp + xpEarned,
      rating: newRating,
      tier: newTier,
      division: newDiv,
      racesCount: prev.racesCount + 1,
      winsCount: userPlace === 1 ? prev.winsCount + 1 : prev.winsCount,
      careerProgress: updatedCareer,
      bossDefeated: updatedBoss,
      records: updatedRecords
    }));

    setRaceResultsData({
      userRacer: results.userRacer,
      allRacers: results.allRacers,
      userPlace,
      xpEarned,
      ratingDelta,
      mistypedKeys: results.mistypedKeys,
      mistypedWords: results.mistypedWords,
      wpmHistory: results.wpmHistory,
      isNewPersonalBest: isPb
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Language & Arena Header Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-2xl shadow-lg shadow-blue-600/30">
            🎮
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>TYPING ARENA</span>
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono">PRO LEAGUE</span>
            </h1>
            <p className="text-xs text-slate-400 font-sans">
              Competitive Racing, Career Progression, Multiplayer &amp; Boss Battles
            </p>
          </div>
        </div>

        {/* Language Selection Buttons */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-950 border border-slate-800 rounded-2xl">
          <button
            onClick={() => setLanguage('nepali')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              language === 'nepali'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🇳🇵 Nepali Romanized
          </button>
          <button
            onClick={() => setLanguage('english')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              language === 'english'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🇬🇧 English Typing
          </button>
        </div>
      </div>

      {/* Hero Player Profile Card (Shown in Hub) */}
      {currentView === 'hub' && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Player Avatar & Identity */}
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-blue-950/90 border border-blue-700/80 flex items-center justify-center text-4xl shadow-xl shadow-blue-950/50 ring-2 ring-blue-500/30">
                {profile.selectedAvatar === 'cyber-kart' ? '🏎️' : profile.selectedAvatar === 'himalayan-falcon' ? '🦅' : '🚀'}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded-md">
                    {profile.equippedTitle || 'Rookie Racer'}
                  </span>
                  <span className="text-xs font-mono text-slate-500">Lvl {profile.level}</span>
                </div>
                <h2 className="text-2xl font-black text-white">Subhash (You)</h2>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>{profile.tier} {profile.division}</span>
                  <span>&bull;</span>
                  <span>{profile.rating} MMR</span>
                  <span>&bull;</span>
                  <span className="text-amber-300 font-bold">{profile.league} League</span>
                </div>
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleQuickRace}
                className="flex-1 md:flex-none px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition-all cursor-pointer shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Quick Race</span>
              </button>

              <button
                onClick={() => setCurrentView('world-multiplayer')}
                className="flex-1 md:flex-none px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm transition-all cursor-pointer shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <Globe className="w-4 h-4" />
                <span>Find Match</span>
              </button>
            </div>
          </div>

          {/* Level XP Progress Bar */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>PLAYER LEVEL {profile.level}</span>
              <span>
                <strong className="text-white">{profile.xp}</strong> / {profile.xpForNextLevel} XP ({Math.round((profile.xp / profile.xpForNextLevel) * 100)}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(100, (profile.xp / profile.xpForNextLevel) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Hub Menu Cards (Grid) */}
      {currentView === 'hub' && (
        <div className="space-y-8">
          {/* Section 1: Solo Campaign */}
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3.5 flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-blue-400" />
              <span>SOLO MODES &amp; CAREER</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Career Mode */}
              <div
                onClick={() => setCurrentView('career')}
                className="bg-slate-900 border border-slate-800 hover:border-blue-500/60 rounded-3xl p-5 sm:p-6 transition-all cursor-pointer shadow-lg hover:shadow-blue-950/40 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-950/80 border border-blue-800 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
                    🏁
                  </div>
                  <h4 className="text-lg font-black text-white group-hover:text-blue-300 transition-colors">
                    Career Mode
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    10 progressive tiers from Rookie to Legend with strict WPM and accuracy qualifiers.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80 text-xs font-bold text-blue-400">
                  <span>Explore Stages</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* AI Battle */}
              <div
                onClick={() => setCurrentView('ai-battle')}
                className="bg-slate-900 border border-slate-800 hover:border-blue-500/60 rounded-3xl p-5 sm:p-6 transition-all cursor-pointer shadow-lg hover:shadow-blue-950/40 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
                    🤖
                  </div>
                  <h4 className="text-lg font-black text-white group-hover:text-blue-300 transition-colors">
                    AI Battle Chamber
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Race against 7 distinct AI bot archetypes (20 to 115+ WPM) with realistic human jitter.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80 text-xs font-bold text-blue-400">
                  <span>Configure Match</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Daily Challenge */}
              <div
                onClick={() => setCurrentView('daily')}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-3xl p-5 sm:p-6 transition-all cursor-pointer shadow-lg hover:shadow-amber-950/40 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-800 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
                    📅
                  </div>
                  <h4 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                    Daily Challenge
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Same synchronized passage for every typist worldwide. Maintain your daily streak.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80 text-xs font-bold text-amber-400">
                  <span>View Daily Race</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Boss Challenges */}
              <div
                onClick={() => setCurrentView('boss')}
                className="bg-slate-900 border border-slate-800 hover:border-rose-500/60 rounded-3xl p-5 sm:p-6 transition-all cursor-pointer shadow-lg hover:shadow-rose-950/40 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
                    👹
                  </div>
                  <h4 className="text-lg font-black text-white group-hover:text-rose-300 transition-colors">
                    Boss Gauntlet
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    6 grueling boss battles with vocabulary, punctuation, and numeric modifiers.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80 text-xs font-bold text-rose-400">
                  <span>Enter Gauntlet</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Weakness Elimination */}
              <div
                onClick={() => setCurrentView('weakness')}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-3xl p-5 sm:p-6 transition-all cursor-pointer shadow-lg hover:shadow-amber-950/40 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-800 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
                    🎯
                  </div>
                  <h4 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                    Weakness Arena
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Auto-generates high-speed races loaded with your weakest keys from live analytics.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80 text-xs font-bold text-amber-400">
                  <span>Target Weak Keys</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Multiplayer & Competition */}
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3.5 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>MULTIPLAYER &amp; ESPORTS</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Local Multiplayer */}
              <div
                onClick={() => setCurrentView('local-multiplayer')}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/60 rounded-3xl p-5 sm:p-6 transition-all cursor-pointer shadow-lg hover:shadow-indigo-950/40 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-800 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
                    🖥️
                  </div>
                  <h4 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors">
                    Local Multiplayer
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    2 to 4 players on the same computer with pass-and-play rounds and instant scoring.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80 text-xs font-bold text-indigo-400">
                  <span>Start Local Battle</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Play With Anyone (World) */}
              <div
                onClick={() => setCurrentView('world-multiplayer')}
                className="bg-slate-900 border border-slate-800 hover:border-blue-500/60 rounded-3xl p-5 sm:p-6 transition-all cursor-pointer shadow-lg hover:shadow-blue-950/40 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-950/80 border border-blue-800 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
                    🌎
                  </div>
                  <h4 className="text-lg font-black text-white group-hover:text-blue-300 transition-colors">
                    Play With Anyone
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Real-time worldwide matchmaking by skill tier and typing language.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80 text-xs font-bold text-blue-400">
                  <span>Find Random Opponent</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Play With Friends / Private Rooms */}
              <div
                onClick={() => setCurrentView('friends')}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/60 rounded-3xl p-5 sm:p-6 transition-all cursor-pointer shadow-lg hover:shadow-indigo-950/40 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-800 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
                    👥
                  </div>
                  <h4 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors">
                    Play With Friends
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Create private rooms with custom codes (e.g. NTP-8F42K), Best-of-3, or Spectator mode.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80 text-xs font-bold text-indigo-400">
                  <span>Create / Join Room</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Weekly Tournament */}
              <div
                onClick={() => setCurrentView('tournament')}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-3xl p-5 sm:p-6 transition-all cursor-pointer shadow-lg hover:shadow-amber-950/40 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-800 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
                    🏆
                  </div>
                  <h4 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                    Weekly Tournament
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Single-elimination championship bracket from Top 32 down to the Grand Final.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80 text-xs font-bold text-amber-400">
                  <span>Enter Bracket</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Rankings & Hall of Fame */}
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3.5 flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>RANKINGS &amp; HALL OF FAME</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Leaderboards */}
              <div
                onClick={() => setCurrentView('leaderboards')}
                className="bg-slate-900 border border-slate-800 hover:border-blue-500/60 rounded-3xl p-5 sm:p-6 transition-all cursor-pointer shadow-lg hover:shadow-blue-950/40 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
                    📊
                  </div>
                  <h4 className="text-lg font-black text-white group-hover:text-blue-300 transition-colors">
                    Competition Leaderboards
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Global, Nepal, Friends, and Weekly League ladders with promotion cutoffs.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80 text-xs font-bold text-blue-400">
                  <span>View Rankings</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Achievements */}
              <div
                onClick={() => setCurrentView('achievements')}
                className="bg-slate-900 border border-slate-800 hover:border-yellow-500/60 rounded-3xl p-5 sm:p-6 transition-all cursor-pointer shadow-lg hover:shadow-yellow-950/40 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-yellow-950/80 border border-yellow-800 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
                    🎖️
                  </div>
                  <h4 className="text-lg font-black text-white group-hover:text-yellow-300 transition-colors">
                    Achievements &amp; Badges
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    25+ tiered awards with XP rewards and avatar unlocks.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80 text-xs font-bold text-yellow-400">
                  <span>Trophy Room</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* My Records */}
              <div
                onClick={() => setCurrentView('records')}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/60 rounded-3xl p-5 sm:p-6 transition-all cursor-pointer shadow-lg hover:shadow-indigo-950/40 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-800 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
                    📈
                  </div>
                  <h4 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors">
                    My Lifetime Records
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Lifetime bests in Nepali &amp; English WPM, longest combo, win streak, and win rate.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80 text-xs font-bold text-indigo-400">
                  <span>View Records</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Views Router */}
      {currentView === 'career' && (
        <CareerModeView
          profile={profile}
          language={language}
          onStartStage={handleStartCareerStage}
          onBack={() => setCurrentView('hub')}
        />
      )}

      {currentView === 'ai-battle' && (
        <AiBattleView
          profile={profile}
          language={language}
          onLaunchRace={(config) => {
            setActiveRaceConfig({
              text: config.text,
              opponents: config.opponents,
              raceTitle: config.raceTitle
            });
            setCurrentView('racing');
          }}
          onBack={() => setCurrentView('hub')}
        />
      )}

      {currentView === 'daily' && (
        <DailyChallengeView
          profile={profile}
          language={language}
          onStartDailyRace={(text) => {
            const opponents: Racer[] = [
              { id: 'daily-rival', name: 'Global Pace Bot', avatar: '🤖', isPlayer: false, isAi: true, wpm: 52, currentProgress: 0, position: 2, status: 'ready' }
            ];
            setActiveRaceConfig({
              text,
              opponents,
              raceTitle: `Daily Challenge (${new Date().toLocaleDateString()})`,
              isDaily: true
            });
            setCurrentView('racing');
          }}
          onBack={() => setCurrentView('hub')}
        />
      )}

      {currentView === 'boss' && (
        <BossChallengesView
          profile={profile}
          language={language}
          onStartBoss={handleStartBoss}
          onBack={() => setCurrentView('hub')}
        />
      )}

      {currentView === 'weakness' && (
        <WeaknessArenaView
          profile={profile}
          language={language}
          liveKeyStatsMap={liveKeyStatsMap}
          onStartWeaknessRace={(config) => {
            setActiveRaceConfig({
              text: config.text,
              opponents: config.opponents,
              raceTitle: config.raceTitle
            });
            setCurrentView('racing');
          }}
          onBack={() => setCurrentView('hub')}
        />
      )}

      {currentView === 'local-multiplayer' && (
        <LocalMultiplayerView
          profile={profile}
          language={language}
          onBack={() => setCurrentView('hub')}
        />
      )}

      {currentView === 'world-multiplayer' && (
        <WorldMultiplayerView
          profile={profile}
          language={language}
          isRanked={false}
          onLaunchMatch={(config) => {
            setActiveRaceConfig({
              text: config.text,
              opponents: config.opponents,
              raceTitle: config.raceTitle,
              isRanked: true
            });
            setCurrentView('racing');
          }}
          onBack={() => setCurrentView('hub')}
        />
      )}

      {currentView === 'friends' && (
        <FriendsMultiplayerView
          profile={profile}
          language={language}
          onLaunchFriendMatch={(config) => {
            setActiveRaceConfig({
              text: config.text,
              opponents: config.opponents,
              raceTitle: config.raceTitle
            });
            setCurrentView('racing');
          }}
          onBack={() => setCurrentView('hub')}
        />
      )}

      {currentView === 'tournament' && (
        <TournamentView
          profile={profile}
          language={language}
          onLaunchTournamentMatch={(config) => {
            setActiveRaceConfig({
              text: config.text,
              opponents: config.opponents,
              raceTitle: config.raceTitle
            });
            setCurrentView('racing');
          }}
          onBack={() => setCurrentView('hub')}
        />
      )}

      {currentView === 'leaderboards' && (
        <ArenaLeaderboardView
          profile={profile}
          language={language}
          onBack={() => setCurrentView('hub')}
        />
      )}

      {currentView === 'achievements' && (
        <AchievementsView
          profile={profile}
          onBack={() => setCurrentView('hub')}
        />
      )}

      {currentView === 'records' && (
        <MyRecordsView
          profile={profile}
          onBack={() => setCurrentView('hub')}
        />
      )}

      {/* Active Racing Screen */}
      {currentView === 'racing' && activeRaceConfig && (
        <ArenaTypingEngine
          language={language}
          targetText={activeRaceConfig.text}
          opponents={activeRaceConfig.opponents}
          userAvatar={profile.selectedAvatar || '🏎️'}
          userName="Subhash"
          onFinishRace={handleFinishRace}
          onExit={() => setCurrentView('hub')}
        />
      )}

      {/* Post Race Results Modal */}
      {raceResultsData && (
        <RaceResultsModal
          userRacer={raceResultsData.userRacer}
          allRacers={raceResultsData.allRacers}
          userPlace={raceResultsData.userPlace}
          xpEarned={raceResultsData.xpEarned}
          ratingDelta={raceResultsData.ratingDelta}
          currentRating={profile.rating}
          tier={profile.tier}
          division={profile.division}
          isNewPersonalBest={raceResultsData.isNewPersonalBest}
          mistypedKeys={raceResultsData.mistypedKeys}
          mistypedWords={raceResultsData.mistypedWords}
          wpmHistory={raceResultsData.wpmHistory}
          onPlayAgain={() => {
            setRaceResultsData(null);
            handleQuickRace();
          }}
          onExitToHub={() => {
            setRaceResultsData(null);
            setCurrentView('hub');
          }}
          onPracticeWeakness={(keys) => {
            setRaceResultsData(null);
            setCurrentView('weakness');
          }}
          gameModeTitle={activeRaceConfig?.raceTitle || 'Typing Arena Race'}
        />
      )}
    </div>
  );
};
