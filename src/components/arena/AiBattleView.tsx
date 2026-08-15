import React, { useState } from 'react';
import { ArenaProfile, ArenaLanguage, Racer } from '../../types/arenaTypes';
import { BOT_ARCHETYPES, QUICK_RACE_TEXTS } from '../../data/arenaData';
import {
  Bot,
  Users,
  Zap,
  Play,
  Gauge,
  Flag,
  Flame,
  Shield,
  Layers
} from 'lucide-react';

interface AiBattleViewProps {
  profile: ArenaProfile;
  language: ArenaLanguage;
  onLaunchRace: (config: {
    opponents: Racer[];
    text: string;
    raceTitle: string;
  }) => void;
  onBack: () => void;
}

export const AiBattleView: React.FC<AiBattleViewProps> = ({
  profile,
  language,
  onLaunchRace,
  onBack
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Normal' | 'Hard' | 'Expert' | 'Master' | 'Legend'>('Normal');
  const [racerCount, setRacerCount] = useState<number>(4);
  const [raceLength, setRaceLength] = useState<'short' | 'medium' | 'long'>('medium');

  const handleStartRace = () => {
    // Generate AI opponents matching the selected difficulty
    const targetBot = BOT_ARCHETYPES.find((b) => b.tier === selectedDifficulty) || BOT_ARCHETYPES[2];
    const otherBots = BOT_ARCHETYPES.filter((b) => b.id !== targetBot.id);

    const generatedOpponents: Racer[] = [];

    // Add primary target bot
    generatedOpponents.push({
      id: `bot-1-${Date.now()}`,
      name: targetBot.name,
      avatar: targetBot.avatar,
      isPlayer: false,
      isAi: true,
      wpm: Math.round((targetBot.minWpm + targetBot.maxWpm) / 2),
      currentProgress: 0,
      position: 2,
      status: 'ready'
    });

    // Add remaining bots to fill racer count (minus user player)
    for (let i = 1; i < racerCount; i++) {
      const b = otherBots[(i - 1) % otherBots.length];
      const botWpm = Math.round(b.minWpm + Math.random() * (b.maxWpm - b.minWpm));
      generatedOpponents.push({
        id: `bot-${i + 1}-${Date.now()}`,
        name: b.name,
        avatar: b.avatar,
        isPlayer: false,
        isAi: true,
        wpm: botWpm,
        currentProgress: 0,
        position: i + 2,
        status: 'ready'
      });
    }

    // Pick text based on language
    const samplePool = QUICK_RACE_TEXTS[language] || QUICK_RACE_TEXTS.english;
    const selectedText = samplePool[Math.floor(Math.random() * samplePool.length)];

    onLaunchRace({
      opponents: generatedOpponents,
      text: selectedText,
      raceTitle: `${selectedDifficulty} AI Battle (${racerCount} Racers)`
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/40 rounded-full text-blue-300 text-xs font-bold font-mono">
            <Bot className="w-3.5 h-3.5" />
            <span>AI BATTLE SIMULATOR</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Custom AI Race Chamber
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Test your typing speed against realistic bots with authentic cadence, human-like reaction times, and adaptive pace.
          </p>
        </div>
      </div>

      {/* Configuration Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Difficulty Selection */}
        <div>
          <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-3">
            Select Bot Tier / Difficulty
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {[
              { id: 'Easy', name: 'Beginner', wpm: '20–25', icon: '🤖' },
              { id: 'Normal', name: 'Novice', wpm: '30–35', icon: '👾' },
              { id: 'Hard', name: 'Advanced', wpm: '55–65', icon: '⚡' },
              { id: 'Expert', name: 'Expert', wpm: '70–85', icon: '🦅' },
              { id: 'Master', name: 'Master', wpm: '90–110', icon: '🔥' },
              { id: 'Legend', name: 'Legend', wpm: '115+', icon: '👑' }
            ].map((tier) => {
              const isSelected = selectedDifficulty === tier.id;
              return (
                <button
                  key={tier.id}
                  onClick={() => setSelectedDifficulty(tier.id as any)}
                  className={`p-3.5 rounded-2xl border transition-all text-center cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/50'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="text-2xl block mb-1">{tier.icon}</span>
                  <strong className="text-xs font-black block">{tier.name}</strong>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                    {tier.wpm} WPM
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid Size / Number of Racers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div>
            <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Grid Size (Total Racers)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { count: 2, label: '1v1 Duel' },
                { count: 4, label: '4-Car Race' },
                { count: 8, label: '8-Car Grand Prix' }
              ].map((grid) => (
                <button
                  key={grid.count}
                  onClick={() => setRacerCount(grid.count)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    racerCount === grid.count
                      ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {grid.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Passage Length
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'short', label: 'Short (~20 words)' },
                { id: 'medium', label: 'Standard (~40 words)' },
                { id: 'long', label: 'Long (~75 words)' }
              ].map((len) => (
                <button
                  key={len.id}
                  onClick={() => setRaceLength(len.id as any)}
                  className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    raceLength === len.id
                      ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {len.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Launch Button */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-5 py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            Back to Arena Hub
          </button>

          <button
            onClick={handleStartRace}
            className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition-all cursor-pointer shadow-lg shadow-blue-600/30 flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start AI Battle</span>
          </button>
        </div>
      </div>
    </div>
  );
};
