import React, { useState, useEffect } from 'react';
import {
  ArenaProfile,
  ArenaLanguage,
  MultiplayerLobbyState,
  MultiplayerPlayer
} from '../../types/arenaTypes';
import {
  multiplayerSocket,
  SocketConnectionStatus,
  CountdownEventData
} from '../../services/multiplayerSocket';
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
  CheckCircle2,
  Wifi,
  WifiOff,
  AlertCircle
} from 'lucide-react';

interface WorldMultiplayerViewProps {
  profile: ArenaProfile;
  language: ArenaLanguage;
  isRanked?: boolean;
  onLaunchMultiplayerMatch: (config: {
    lobby: MultiplayerLobbyState;
    countdownData: CountdownEventData;
    isHost: boolean;
  }) => void;
  onBack: () => void;
}

export const WorldMultiplayerView: React.FC<WorldMultiplayerViewProps> = ({
  profile,
  language,
  isRanked = false,
  onLaunchMultiplayerMatch,
  onBack
}) => {
  const [matchmakingState, setMatchmakingState] = useState<'idle' | 'searching' | 'matched'>('idle');
  const [queueElapsedSec, setQueueElapsedSec] = useState<number>(0);
  const [connectionStatus, setConnectionStatus] = useState<SocketConnectionStatus>('disconnected');
  const [lobbyState, setLobbyState] = useState<MultiplayerLobbyState | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const playerId = multiplayerSocket.getPlayerId();
  const displayName = (() => {
    try {
      const saved = localStorage.getItem('ntp_user_display_name');
      if (saved) return saved;
    } catch {}
    return 'Subhash Lamichhane';
  })();

  useEffect(() => {
    const unsubStatus = multiplayerSocket.onStatusChange((status) => {
      setConnectionStatus(status);
      if (status === 'connected') {
        setErrorMessage(null);
      }
    });

    const unsubLobby = multiplayerSocket.onLobbyState((lobby) => {
      setLobbyState(lobby);
      if (matchmakingState === 'searching' && lobby.players.length >= 1) {
        setMatchmakingState('matched');
      }
    });

    const unsubCountdown = multiplayerSocket.onCountdown((data) => {
      if (lobbyState) {
        const isHost = lobbyState.players.find((p) => p.id === playerId)?.isHost ?? false;
        onLaunchMultiplayerMatch({
          lobby: lobbyState,
          countdownData: data,
          isHost
        });
      }
    });

    const unsubError = multiplayerSocket.onError((err) => {
      setErrorMessage(err);
      setMatchmakingState('idle');
    });

    multiplayerSocket.connect();

    return () => {
      unsubStatus();
      unsubLobby();
      unsubCountdown();
      unsubError();
    };
  }, [lobbyState, matchmakingState, playerId, onLaunchMultiplayerMatch]);

  // Queue timer ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (matchmakingState === 'searching') {
      setQueueElapsedSec(0);
      interval = setInterval(() => {
        setQueueElapsedSec((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [matchmakingState]);

  const handleStartSearching = async () => {
    setMatchmakingState('searching');
    setErrorMessage(null);

    await multiplayerSocket.quickMatch(
      {
        id: playerId,
        name: displayName,
        avatar: profile.selectedAvatar || '🏎️'
      },
      language
    );
  };

  const handleCancelSearch = () => {
    multiplayerSocket.leaveLobby();
    setMatchmakingState('idle');
    setLobbyState(null);
  };

  const handleHostStart = () => {
    if (lobbyState) {
      multiplayerSocket.startMatch(4000);
    }
  };

  const isHost = lobbyState?.players.find((p) => p.id === playerId)?.isHost ?? false;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/40 rounded-full text-blue-300 text-xs font-bold font-mono">
            <Globe className="w-3.5 h-3.5" />
            <span>{isRanked ? 'COMPETITIVE RANKED QUEUE' : 'GLOBAL QUICK PLAY'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isRanked ? 'Ranked Matchmaking' : 'World Matchmaking'}
          </h2>
          <p className="text-sm text-slate-400">
            Compete live against other real typists in server-authoritative matches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              connectionStatus === 'connected'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            {connectionStatus === 'connected' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <Wifi className="w-3.5 h-3.5" />
                <span>Live Server</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span>Connecting...</span>
              </>
            )}
          </div>

          <button
            onClick={onBack}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition"
          >
            Back to Arena
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-950/50 border border-rose-800/80 rounded-2xl flex items-center gap-3 text-rose-300 text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Matchmaking Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
        {matchmakingState === 'idle' && (
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-3xl shadow-inner">
              <Globe className="w-10 h-10 text-blue-400 animate-pulse" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">Find Opponent</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Connect to the live match queue for{' '}
                <span className="text-blue-300 font-bold">
                  {language === 'nepali' ? 'Nepali Romanized Unicode' : 'English Velocity'}
                </span>
                .
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
              <span className="px-3 py-1 bg-slate-950 rounded-lg border border-slate-800">
                Your Rating: <strong className="text-amber-400">{profile.rating} RP</strong>
              </span>
              <span className="px-3 py-1 bg-slate-950 rounded-lg border border-slate-800">
                Rank: <strong className="text-indigo-300">{profile.tier} {profile.division}</strong>
              </span>
            </div>

            <button
              onClick={handleStartSearching}
              disabled={connectionStatus !== 'connected'}
              className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-2xl font-black text-base tracking-wide shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Zap className="w-5 h-5 fill-white" />
              <span>FIND MATCH NOW</span>
            </button>
          </div>
        )}

        {matchmakingState === 'searching' && (
          <div className="max-w-md mx-auto space-y-6 animate-fade-in">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-400 animate-spin" />
              <Radio className="w-10 h-10 text-blue-400 animate-pulse" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">Searching for Competitors...</h3>
              <p className="text-sm text-slate-400 mt-1 font-mono">
                Queue Time: <span className="text-white font-bold">{queueElapsedSec}s</span>
              </p>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Matching you with players in your skill bracket...
            </p>

            <button
              onClick={handleCancelSearch}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs border border-slate-700 transition"
            >
              Cancel Matchmaking
            </button>
          </div>
        )}

        {matchmakingState === 'matched' && lobbyState && (
          <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">Match Lobby Formed!</h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Lobby Code: <strong className="text-indigo-400">{lobbyState.roomId}</strong> • Match: <strong className="text-amber-300">{lobbyState.matchId}</strong>
              </p>
            </div>

            {/* Players in this public match */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {lobbyState.players.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl">
                    {p.avatar || '🏎️'}
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-bold text-white truncate">{p.name}</div>
                    <div className="text-[11px] text-emerald-400 font-mono">🟢 Ready</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              {isHost ? (
                <button
                  onClick={handleHostStart}
                  className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-2xl font-black text-sm tracking-wide shadow-xl shadow-emerald-600/30 flex items-center gap-2 transition"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>START SYNCHRONIZED RACE</span>
                </button>
              ) : (
                <div className="text-sm text-slate-300 font-medium animate-pulse">
                  Waiting for host to initiate countdown...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
