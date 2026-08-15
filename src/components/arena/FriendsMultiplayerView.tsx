import React, { useState, useEffect } from 'react';
import {
  ArenaProfile,
  ArenaLanguage,
  MultiplayerLobbyState,
  MultiplayerPlayer,
  OfficialMultiplayerResult
} from '../../types/arenaTypes';
import {
  multiplayerSocket,
  SocketConnectionStatus,
  CountdownEventData
} from '../../services/multiplayerSocket';
import {
  Users,
  Copy,
  Check,
  Play,
  Share2,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Wifi,
  WifiOff,
  UserCheck,
  Globe,
  Settings,
  AlertCircle,
  Edit2
} from 'lucide-react';

interface FriendsMultiplayerViewProps {
  profile: ArenaProfile;
  language: ArenaLanguage;
  onLaunchMultiplayerMatch: (config: {
    lobby: MultiplayerLobbyState;
    countdownData: CountdownEventData;
    isHost: boolean;
  }) => void;
  onBack: () => void;
}

export const FriendsMultiplayerView: React.FC<FriendsMultiplayerViewProps> = ({
  profile,
  language: initialLanguage,
  onLaunchMultiplayerMatch,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [roomCodeInput, setRoomCodeInput] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>(() => {
    return `NTP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  });

  // Display Name management
  const [displayName, setDisplayName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('ntp_user_display_name');
      if (saved) return saved;
    } catch {}
    return profile.equippedTitle && profile.equippedTitle !== 'Rookie Racer'
      ? `${profile.equippedTitle} Typist`
      : 'Subhash Lamichhane';
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(displayName);

  // Connection & Room state
  const [connectionStatus, setConnectionStatus] = useState<SocketConnectionStatus>('disconnected');
  const [lobbyState, setLobbyState] = useState<MultiplayerLobbyState | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);

  // Format & Language inside lobby
  const [selectedLanguage, setSelectedLanguage] = useState<ArenaLanguage>(initialLanguage);
  const [selectedFormat, setSelectedFormat] = useState<'single' | 'best-of-3' | 'best-of-5'>('best-of-3');

  const playerId = multiplayerSocket.getPlayerId();
  const isHost = lobbyState?.players.find((p) => p.id === playerId)?.isHost ?? false;
  const currentPlayer = lobbyState?.players.find((p) => p.id === playerId);

  // Initialize socket connection & event listeners
  useEffect(() => {
    const unsubStatus = multiplayerSocket.onStatusChange((status) => {
      setConnectionStatus(status);
      if (status === 'connected') {
        setErrorMessage(null);
      }
    });

    const unsubLobby = multiplayerSocket.onLobbyState((lobby) => {
      setLobbyState(lobby);
      setSelectedLanguage(lobby.language);
      setSelectedFormat(lobby.format);
      setIsJoining(false);
      setErrorMessage(null);
    });

    const unsubCountdown = multiplayerSocket.onCountdown((data) => {
      if (lobbyState) {
        onLaunchMultiplayerMatch({
          lobby: lobbyState,
          countdownData: data,
          isHost
        });
      }
    });

    const unsubError = multiplayerSocket.onError((err) => {
      setErrorMessage(err);
      setIsJoining(false);
    });

    const unsubSysMsg = multiplayerSocket.onSystemMessage((msg) => {
      setSystemLogs((prev) => [msg, ...prev.slice(0, 4)]);
    });

    multiplayerSocket.connect();

    return () => {
      unsubStatus();
      unsubLobby();
      unsubCountdown();
      unsubError();
      unsubSysMsg();
    };
  }, [lobbyState, isHost, onLaunchMultiplayerMatch]);

  const handleSaveName = () => {
    const trimmed = tempName.trim();
    if (trimmed) {
      setDisplayName(trimmed);
      try {
        localStorage.setItem('ntp_user_display_name', trimmed);
      } catch {}
      setIsEditingName(false);
    }
  };

  const handleCreateRoom = async () => {
    setIsJoining(true);
    setErrorMessage(null);
    const code = generatedCode.trim().toUpperCase();

    await multiplayerSocket.joinLobby(
      code,
      {
        id: playerId,
        name: displayName,
        avatar: profile.selectedAvatar || '🏎️'
      },
      selectedLanguage,
      selectedFormat,
      true // isCreate
    );
  };

  const handleJoinRoom = async () => {
    const code = roomCodeInput.trim().toUpperCase();
    if (!code) {
      setErrorMessage('Please enter a valid room code.');
      return;
    }

    setIsJoining(true);
    setErrorMessage(null);

    await multiplayerSocket.joinLobby(
      code,
      {
        id: playerId,
        name: displayName,
        avatar: profile.selectedAvatar || '🚀'
      },
      selectedLanguage,
      selectedFormat,
      false // join existing
    );
  };

  const handleToggleReady = () => {
    if (currentPlayer) {
      multiplayerSocket.toggleReady(!currentPlayer.isReady);
    }
  };

  const handleLanguageChange = (newLang: ArenaLanguage) => {
    if (!isHost) return;
    setSelectedLanguage(newLang);
    multiplayerSocket.updateSettings(newLang, selectedFormat);
  };

  const handleFormatChange = (newFormat: 'single' | 'best-of-3' | 'best-of-5') => {
    if (!isHost) return;
    setSelectedFormat(newFormat);
    multiplayerSocket.updateSettings(selectedLanguage, newFormat);
  };

  const handleStartMatch = () => {
    if (!isHost) return;
    multiplayerSocket.startMatch(4000); // 4-second synchronized server countdown
  };

  const handleCopyLink = () => {
    if (!lobbyState) return;
    const url = `${window.location.origin}/#arena?room=${lobbyState.roomId}`;
    try {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {}
  };

  const handleLeaveLobby = () => {
    multiplayerSocket.leaveLobby();
    setLobbyState(null);
    setGeneratedCode(`NTP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/40 rounded-full text-indigo-300 text-xs font-bold font-mono">
            <Users className="w-3.5 h-3.5" />
            <span>REAL-TIME MULTIPLAYER LOBBY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Private Friends Arena
          </h2>
          <p className="text-sm text-slate-400">
            One shared authoritative session with synchronized countdown and live race track lanes.
          </p>
        </div>

        {/* Connection Status Badge */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              connectionStatus === 'connected'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : connectionStatus === 'connecting'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            {connectionStatus === 'connected' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <Wifi className="w-3.5 h-3.5" />
                <span>Authoritative Server: Online</span>
              </>
            ) : connectionStatus === 'connecting' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span>Disconnected</span>
              </>
            )}
          </div>

          <button
            onClick={lobbyState ? handleLeaveLobby : onBack}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition"
          >
            {lobbyState ? 'Leave Lobby' : 'Back to Arena'}
          </button>
        </div>
      </div>

      {/* User Identity Display Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xl shadow-inner">
            {profile.selectedAvatar || '🏎️'}
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Your Racer Identity</div>
            {isEditingName ? (
              <div className="flex items-center gap-2 mt-0.5">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="px-2.5 py-1 bg-slate-800 border border-indigo-500 rounded-lg text-sm text-white font-bold focus:outline-none"
                  maxLength={25}
                />
                <button
                  onClick={handleSaveName}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">{displayName}</span>
                <button
                  onClick={() => {
                    setTempName(displayName);
                    setIsEditingName(true);
                  }}
                  className="text-slate-400 hover:text-indigo-400 transition"
                  title="Change Display Name"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Player ID:</span>
            <span className="font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {playerId}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Rating:</span>
            <span className="font-bold text-amber-400">{profile.rating} RP</span>
          </div>
        </div>
      </div>

      {/* Error Alert if any */}
      {errorMessage && (
        <div className="p-4 bg-rose-950/50 border border-rose-800/80 rounded-2xl flex items-center gap-3 text-rose-300 text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* VIEW A: JOIN / CREATE LOBBY SCREEN */}
      {!lobbyState ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Room Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-lg">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Create Private Lobby</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Host an authoritative room, set the language and round format, and invite your friends.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                    Lobby Code (Auto-Generated)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={generatedCode}
                      onChange={(e) => setGeneratedCode(e.target.value.toUpperCase())}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-indigo-300 font-mono font-bold tracking-wider text-base focus:border-indigo-500 focus:outline-none uppercase"
                      maxLength={10}
                    />
                    <button
                      onClick={() =>
                        setGeneratedCode(`NTP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`)
                      }
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                      title="Generate New Code"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">Language</label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value as ArenaLanguage)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="nepali">🇳🇵 Nepali Unicode</option>
                      <option value="english">🇬🇧 English Velocity</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">Format</label>
                    <select
                      value={selectedFormat}
                      onChange={(e) => setSelectedFormat(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="single">Single Race</option>
                      <option value="best-of-3">Best of 3</option>
                      <option value="best-of-5">Best of 5</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleCreateRoom}
              disabled={isJoining || connectionStatus === 'disconnected'}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl font-black text-sm tracking-wide shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Users className="w-4 h-4" />
              <span>{isJoining ? 'Creating Room...' : 'CREATE ROOM'}</span>
            </button>
          </div>

          {/* Join Room Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-lg">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Join Existing Lobby</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your friend's room code to join their authoritative session.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                    Enter 5-8 Character Room Code
                  </label>
                  <input
                    type="text"
                    value={roomCodeInput}
                    onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                    placeholder="e.g. NTP-7K4P9"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-emerald-300 font-mono font-bold tracking-widest text-lg focus:border-emerald-500 focus:outline-none uppercase placeholder:text-slate-600"
                    maxLength={12}
                  />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Both devices will automatically synchronize player names, target text, countdowns, and real-time typing lanes.
                </p>
              </div>
            </div>

            <button
              onClick={handleJoinRoom}
              disabled={isJoining || !roomCodeInput.trim() || connectionStatus === 'disconnected'}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-black text-sm tracking-wide shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isJoining ? 'Connecting to Room...' : 'JOIN ROOM'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* VIEW B: INSIDE ACTIVE AUTHORITATIVE LOBBY */
        <div className="space-y-6 animate-fade-in">
          {/* Lobby Information Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <div className="text-xs text-slate-400 font-medium">AUTHORITATIVE LOBBY CODE</div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-3xl font-black text-indigo-400 font-mono tracking-wider">
                    {lobbyState.roomId}
                  </span>
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied Code & Link' : 'Copy Invitation'}</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300">
                  <span className="text-slate-500">Match ID: </span>
                  <span className="text-amber-300 font-bold">{lobbyState.matchId}</span>
                </div>
                <div className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300">
                  <span className="text-slate-500">Round: </span>
                  <span className="text-emerald-400 font-bold">
                    {lobbyState.currentRound} of {lobbyState.totalRounds}
                  </span>
                </div>
              </div>
            </div>

            {/* Room Settings Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-6">
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5">
                <label className="text-xs text-slate-400 font-medium block mb-1">Race Language</label>
                {isHost ? (
                  <select
                    value={lobbyState.language}
                    onChange={(e) => handleLanguageChange(e.target.value as ArenaLanguage)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none"
                  >
                    <option value="nepali">🇳🇵 Nepali Romanized Unicode</option>
                    <option value="english">🇬🇧 English Velocity</option>
                  </select>
                ) : (
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-1">
                    <span>{lobbyState.language === 'nepali' ? '🇳🇵 Nepali Unicode' : '🇬🇧 English Velocity'}</span>
                    <span className="text-slate-500 text-[10px]">(Host set)</span>
                  </div>
                )}
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5">
                <label className="text-xs text-slate-400 font-medium block mb-1">Match Format</label>
                {isHost ? (
                  <select
                    value={lobbyState.format}
                    onChange={(e) => handleFormatChange(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none"
                  >
                    <option value="single">Single Race</option>
                    <option value="best-of-3">Best of 3</option>
                    <option value="best-of-5">Best of 5</option>
                  </select>
                ) : (
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-1">
                    <span className="uppercase">{lobbyState.format}</span>
                    <span className="text-slate-500 text-[10px]">(Host set)</span>
                  </div>
                )}
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 sm:col-span-2 md:col-span-1">
                <label className="text-xs text-slate-400 font-medium block mb-1">Target Text Title</label>
                <div className="text-xs font-bold text-indigo-300 truncate mt-1">
                  {lobbyState.textTitle || 'Authoritative Match Passage'}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                  ID: {lobbyState.textId || 'AUT-01'}
                </div>
              </div>
            </div>
          </div>

          {/* Connected Players List */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Connected Players ({lobbyState.players.length})</h3>
              </div>
              <div className="text-xs text-slate-400">
                All connected devices see this exact authoritative list
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {lobbyState.players.map((p, idx) => {
                const isMe = p.id === playerId;
                const score = lobbyState.scores[p.id] || 0;

                return (
                  <div
                    key={p.id}
                    className={`border rounded-2xl p-4 flex items-center justify-between transition-all ${
                      isMe
                        ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl">
                          {p.avatar || '🏎️'}
                        </div>
                        {p.connected ? (
                          <span
                            className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full"
                            title="Connected"
                          />
                        ) : (
                          <span
                            className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-slate-900 rounded-full"
                            title="Disconnected"
                          />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{p.name}</span>
                          {isMe && (
                            <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px] font-bold">
                              YOU
                            </span>
                          )}
                          {p.isHost && (
                            <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[10px] font-bold">
                              HOST
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-mono">
                          <span>{p.connected ? '🟢 Connected' : '🔴 Disconnected'}</span>
                          {lobbyState.format !== 'single' && (
                            <span className="text-amber-400 font-bold">• Score: {score}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div>
                      {p.isReady ? (
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full text-xs font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>READY</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full text-xs font-bold">
                          NOT READY
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Match Start / Ready Action Bar */}
            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 text-center sm:text-left">
                {isHost ? (
                  <span>You are the Lobby Host. Click Start Match when all racers are Ready.</span>
                ) : (
                  <span>Click Ready to signal the host you are prepared for the countdown.</span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {!isHost && (
                  <button
                    onClick={handleToggleReady}
                    className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-bold text-sm transition ${
                      currentPlayer?.isReady
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                    }`}
                  >
                    {currentPlayer?.isReady ? 'Cancel Ready' : 'I AM READY'}
                  </button>
                )}

                {isHost && (
                  <button
                    onClick={handleStartMatch}
                    disabled={lobbyState.players.length === 0}
                    className="flex-1 sm:flex-none px-8 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white rounded-2xl font-black text-sm tracking-wide shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>START SYNCHRONIZED MATCH</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* System logs ticker */}
          {systemLogs.length > 0 && (
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3 text-xs text-slate-400 font-mono space-y-1">
              {systemLogs.map((log, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-indigo-400">•</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
