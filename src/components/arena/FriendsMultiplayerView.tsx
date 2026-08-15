import React, { useState } from 'react';
import { ArenaProfile, ArenaLanguage, Racer } from '../../types/arenaTypes';
import { QUICK_RACE_TEXTS } from '../../data/arenaData';
import {
  Users,
  Copy,
  Check,
  Play,
  Lock,
  Eye,
  Share2,
  ShieldCheck,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface FriendsMultiplayerViewProps {
  profile: ArenaProfile;
  language: ArenaLanguage;
  onLaunchFriendMatch: (config: {
    opponents: Racer[];
    text: string;
    raceTitle: string;
  }) => void;
  onBack: () => void;
}

export const FriendsMultiplayerView: React.FC<FriendsMultiplayerViewProps> = ({
  profile,
  language,
  onLaunchFriendMatch,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [roomCode, setRoomCode] = useState<string>(() => {
    return `NTP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  });
  const [copiedLink, setCopiedLink] = useState(false);
  const [matchFormat, setMatchFormat] = useState<'single' | 'best-of-3' | 'best-of-5'>('best-of-3');
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [inLobby, setInLobby] = useState(false);

  const [lobbyPlayers, setLobbyPlayers] = useState<Racer[]>([
    {
      id: 'host-player',
      name: `${profile.equippedTitle || 'Typist'} (Host)`,
      avatar: profile.selectedAvatar || '🏎️',
      isPlayer: true,
      isAi: false,
      wpm: profile.records.highestWpmEnglish || 60,
      currentProgress: 0,
      position: 1,
      status: 'ready'
    },
    {
      id: 'friend-1',
      name: 'Anil_KTM',
      avatar: '🚀',
      isPlayer: false,
      isAi: true,
      wpm: 58,
      currentProgress: 0,
      position: 2,
      status: 'ready'
    }
  ]);

  const handleCopyLink = () => {
    const link = `https://nepalitypingpro.com/arena?room=${roomCode}`;
    try {
      navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {}
  };

  const handleCreateRoom = () => {
    setInLobby(true);
  };

  const handleStartGame = () => {
    const samplePool = QUICK_RACE_TEXTS[language] || QUICK_RACE_TEXTS.english;
    const selectedText = samplePool[Math.floor(Math.random() * samplePool.length)];

    onLaunchFriendMatch({
      opponents: lobbyPlayers.filter((p) => !p.isPlayer),
      text: selectedText,
      raceTitle: `Private Room (${roomCode}) &bull; ${matchFormat.toUpperCase()}`
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/40 rounded-full text-indigo-300 text-xs font-bold font-mono">
            <Users className="w-3.5 h-3.5" />
            <span>FRIENDS &amp; PRIVATE ROOMS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Challenge Your Friends Anywhere
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Create custom private lobbies, choose Best-of-3 or Best-of-5 series, share invite codes, or invite spectators to watch live races.
          </p>
        </div>
      </div>

      {/* Main Card */}
      {!inLobby ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          {/* Tabs: Create Room vs Join Room */}
          <div className="flex border-b border-slate-800 pb-4 gap-4">
            <button
              onClick={() => setActiveTab('create')}
              className={`text-sm font-bold pb-2 transition-all cursor-pointer border-b-2 ${
                activeTab === 'create'
                  ? 'border-blue-500 text-blue-400 font-black'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Private Room
            </button>

            <button
              onClick={() => setActiveTab('join')}
              className={`text-sm font-bold pb-2 transition-all cursor-pointer border-b-2 ${
                activeTab === 'join'
                  ? 'border-blue-500 text-blue-400 font-black'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Join with Room Code
            </button>
          </div>

          {activeTab === 'create' ? (
            <div className="space-y-6">
              {/* Generated Room Code Banner */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Generated Room ID</span>
                  <strong className="text-2xl font-black text-white font-mono">{roomCode}</strong>
                </div>

                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Invite Link Copied!' : 'Copy Invite Link'}</span>
                </button>
              </div>

              {/* Series Format (Single, Best of 3, Best of 5) */}
              <div>
                <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-3">
                  Match Series Format
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'single', label: 'Single Race' },
                    { id: 'best-of-3', label: 'Best of 3 Series' },
                    { id: 'best-of-5', label: 'Best of 5 Series' }
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      onClick={() => setMatchFormat(fmt.id as any)}
                      className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        matchFormat === fmt.id
                          ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={onBack}
                  className="px-5 py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Back
                </button>

                <button
                  onClick={handleCreateRoom}
                  className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition-all cursor-pointer shadow-lg shadow-blue-600/30 flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Open Room Lobby</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-md mx-auto text-center py-4">
              <input
                type="text"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                placeholder="Enter Room Code (e.g. NTP-8F42K)"
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-2xl px-5 py-4 text-center text-lg font-mono text-white placeholder-slate-600 focus:outline-none uppercase"
              />

              <button
                onClick={() => {
                  if (joinCodeInput) setInLobby(true);
                }}
                disabled={!joinCodeInput}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition-all cursor-pointer shadow-lg disabled:opacity-50"
              >
                Join Friend Room
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Active Lobby Card */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-slate-500 uppercase font-bold">PRIVATE LOBBY</span>
              <h3 className="text-xl font-black text-white font-mono">Room: {roomCode}</h3>
            </div>

            <button
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Share Link'}</span>
            </button>
          </div>

          {/* Lobby Players List */}
          <div className="space-y-2 font-mono text-xs">
            {lobbyPlayers.map((player, idx) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{player.avatar}</span>
                  <div>
                    <strong className="text-sm font-sans text-white block">{player.name}</strong>
                    <span className="text-slate-500 text-[11px]">{player.wpm} WPM Avg</span>
                  </div>
                </div>

                <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-xl text-[11px]">
                  <Check className="w-3.5 h-3.5" /> Ready
                </span>
              </div>
            ))}
          </div>

          {/* Start CTA */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setInLobby(false)}
              className="px-5 py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              Leave Lobby
            </button>

            <button
              onClick={handleStartGame}
              className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition-all cursor-pointer shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Match Now</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
