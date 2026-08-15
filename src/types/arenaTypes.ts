export type ArenaLanguage = 'nepali' | 'english';

export type ArenaGameMode =
  | 'career'
  | 'ai-battle'
  | 'daily'
  | 'boss'
  | 'weakness'
  | 'local-multiplayer'
  | 'world-multiplayer'
  | 'friends'
  | 'tournament'
  | 'ranked';

export type CompetitiveTier =
  | 'Bronze'
  | 'Silver'
  | 'Gold'
  | 'Platinum'
  | 'Diamond'
  | 'Master'
  | 'Grandmaster'
  | 'Legend';

export type CompetitiveDivision = 'III' | 'II' | 'I';

export type LeagueName =
  | 'Learner'
  | 'Novice'
  | 'Rookie'
  | 'Pro'
  | 'Ace'
  | 'Expert'
  | 'Champion'
  | 'Master'
  | 'Epic'
  | 'Legend';

export interface ArenaProfile {
  level: number;
  xp: number;
  xpForNextLevel: number;
  totalXp: number;
  rating: number; // MMR e.g. 1200
  tier: CompetitiveTier;
  division: CompetitiveDivision;
  league: LeagueName;
  leaguePoints: number;
  leagueRank: number;
  racesCount: number;
  winsCount: number;
  podiumsCount: number;
  highestWpm: number;
  highestNetWpm: number;
  bestAccuracy: number;
  longestCombo: number;
  bestStreak: number;
  currentStreak: number;
  streakDays: number;
  lastPlayedDate: string;
  selectedAvatar: string;
  unlockedAvatars: string[];
  equippedTitle: string;
  unlockedTitles: string[];
  careerProgress: Record<string, { completed: boolean; stars: number; bestWpm: number; bestAcc: number }>;
  bossDefeated: Record<string, { defeated: boolean; bestTime: number; stars: number }>;
  achievements: Record<string, { unlocked: boolean; progress: number; max: number; unlockedAt?: number }>;
  records: ArenaRecords;
}

export interface ArenaRecords {
  highestWpmNepali: number;
  highestWpmEnglish: number;
  highestNetWpm: number;
  bestAccuracy: number;
  longestCombo: number;
  fastestRaceTimeSeconds: number;
  totalRacesWon: number;
  winRate: number;
  highestRankReached: string;
  longestWinStreak: number;
  currentWinStreak: number;
  bestDailyChallengeWpm: number;
  totalWordsTypedInArena: number;
}

export interface Racer {
  id: string;
  name: string;
  avatar: string;
  isPlayer: boolean;
  isAi: boolean;
  wpm: number;
  currentProgress: number; // 0 to 100
  position: number; // 1, 2, 3, 4...
  status: 'waiting' | 'ready' | 'racing' | 'finished' | 'disconnected';
  finishTime?: number;
  netWpm?: number;
  grossWpm?: number;
  accuracy?: number;
  mistakes?: number;
  rating?: number;
  rankTier?: CompetitiveTier;
  rankDivision?: CompetitiveDivision;
  comboCount?: number;
  hasShield?: boolean;
}

export interface CareerStage {
  id: string;
  stageNumber: number;
  title: string;
  description: string;
  targetWpm: number;
  targetAccuracy: number;
  textNepali: string;
  textEnglish: string;
  xpReward: number;
}

export interface CareerLevel {
  levelNumber: number;
  tierName: string;
  title: string;
  iconName: string;
  minLevelToUnlock: number;
  stages: CareerStage[];
}

export interface BossChallenge {
  id: string;
  bossNumber: number;
  name: string;
  subtitle: string;
  description: string;
  avatarIcon: string;
  health: number; // e.g. 100
  modifier: string;
  targetWpm: number;
  minAccuracy: number;
  timeLimitSeconds: number;
  textNepali: string;
  textEnglish: string;
  xpReward: number;
  badgeReward: string;
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  category: 'speed' | 'accuracy' | 'streak' | 'races' | 'career' | 'mastery';
  icon: string;
  maxProgress: number;
  xpReward: number;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
}

export interface ArenaLeaderboardEntry {
  rank: number;
  playerName: string;
  avatar: string;
  country: string;
  wpm: number;
  accuracy: number;
  rating: number;
  tier: CompetitiveTier;
  division: CompetitiveDivision;
  wins: number;
  isCurrentUser?: boolean;
}

export interface TournamentMatch {
  id: string;
  roundName: 'Round of 32' | 'Round of 16' | 'Quarter Final' | 'Semi Final' | 'Grand Final';
  player1: { name: string; avatar: string; wpm: number; isUser?: boolean; isWinner?: boolean };
  player2: { name: string; avatar: string; wpm: number; isUser?: boolean; isWinner?: boolean };
  status: 'upcoming' | 'in_progress' | 'completed';
  winner?: string;
}

export interface LocalPlayerConfig {
  id: string;
  name: string;
  avatar: string;
  color: string;
  score: number;
  wpm: number;
  accuracy: number;
  finished: boolean;
  timeSeconds: number;
}

export interface RoomConfig {
  roomId: string;
  roomCode: string;
  hostName: string;
  language: ArenaLanguage;
  format: 'single' | 'best-of-3' | 'best-of-5' | 'best-of-7';
  maxPlayers: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  isPrivate: boolean;
  allowSpectators: boolean;
  currentRound: number;
  totalRounds: number;
  playerScores: Record<string, number>;
}
