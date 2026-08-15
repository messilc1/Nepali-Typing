import {
  ArenaProfile,
  CareerLevel,
  BossChallenge,
  AchievementDef,
  CompetitiveTier,
  CompetitiveDivision,
  LeagueName,
  ArenaLeaderboardEntry
} from '../types/arenaTypes';

export const INITIAL_ARENA_PROFILE: ArenaProfile = {
  level: 1,
  xp: 0,
  xpForNextLevel: 300,
  totalXp: 0,
  rating: 1000,
  tier: 'Bronze',
  division: 'III',
  league: 'Learner',
  leaguePoints: 45,
  leagueRank: 12,
  racesCount: 0,
  winsCount: 0,
  podiumsCount: 0,
  highestWpm: 0,
  highestNetWpm: 0,
  bestAccuracy: 0,
  longestCombo: 0,
  bestStreak: 0,
  currentStreak: 0,
  streakDays: 1,
  lastPlayedDate: new Date().toISOString().split('T')[0],
  selectedAvatar: 'cyber-kart',
  unlockedAvatars: ['cyber-kart', 'speedster', 'himalayan-falcon'],
  equippedTitle: 'Rookie Racer',
  unlockedTitles: ['Rookie Racer', 'Key Explorer'],
  careerProgress: {},
  bossDefeated: {},
  achievements: {
    first_race: { unlocked: false, progress: 0, max: 1 },
    speedster_30: { unlocked: false, progress: 0, max: 30 },
    speedster_50: { unlocked: false, progress: 0, max: 50 },
    speedster_75: { unlocked: false, progress: 0, max: 75 },
    speedster_100: { unlocked: false, progress: 0, max: 100 },
    precision_95: { unlocked: false, progress: 0, max: 1 },
    precision_99: { unlocked: false, progress: 0, max: 1 },
    combo_50: { unlocked: false, progress: 0, max: 50 },
    combo_100: { unlocked: false, progress: 0, max: 100 },
    career_l3: { unlocked: false, progress: 0, max: 3 },
    career_l7: { unlocked: false, progress: 0, max: 7 },
    career_l10: { unlocked: false, progress: 0, max: 10 },
    boss_1: { unlocked: false, progress: 0, max: 1 },
    boss_3: { unlocked: false, progress: 0, max: 1 },
    boss_6: { unlocked: false, progress: 0, max: 1 },
    races_10: { unlocked: false, progress: 0, max: 10 },
    races_50: { unlocked: false, progress: 0, max: 50 },
    wins_10: { unlocked: false, progress: 0, max: 10 },
    wins_25: { unlocked: false, progress: 0, max: 25 },
    rank_gold: { unlocked: false, progress: 0, max: 1 },
    rank_diamond: { unlocked: false, progress: 0, max: 1 },
    rank_legend: { unlocked: false, progress: 0, max: 1 },
    daily_streak_3: { unlocked: false, progress: 0, max: 3 },
    daily_streak_7: { unlocked: false, progress: 0, max: 7 },
    nepali_master: { unlocked: false, progress: 0, max: 1 }
  },
  records: {
    highestWpmNepali: 0,
    highestWpmEnglish: 0,
    highestNetWpm: 0,
    bestAccuracy: 0,
    longestCombo: 0,
    fastestRaceTimeSeconds: 0,
    totalRacesWon: 0,
    winRate: 0,
    highestRankReached: 'Bronze III',
    longestWinStreak: 0,
    currentWinStreak: 0,
    bestDailyChallengeWpm: 0,
    totalWordsTypedInArena: 0
  }
};

export const AVATAR_OPTIONS = [
  { id: 'cyber-kart', name: 'Cyber Kart', icon: '🏎️', requiredLevel: 1, description: 'Streamlined neon speedster' },
  { id: 'speedster', name: 'Aero Racer', icon: '🏎', requiredLevel: 1, description: 'Classic aerodynamic formula car' },
  { id: 'himalayan-falcon', name: 'Himalayan Falcon', icon: '🦅', requiredLevel: 1, description: 'High-altitude mountain flyer' },
  { id: 'turbo-bike', name: 'Turbo Bike', icon: '🏍️', requiredLevel: 3, description: 'Agile dual-exhaust rocket bike' },
  { id: 'lightning-jet', name: 'Lightning Jet', icon: '🚀', requiredLevel: 5, description: 'Supersonic jet with ion thrusters' },
  { id: 'everest-rover', name: 'Everest Rover', icon: '🚙', requiredLevel: 7, description: 'All-terrain high torque crawler' },
  { id: 'golden-chariot', name: 'Golden Chariot', icon: '👑', requiredLevel: 10, description: 'Legendary gilded royal runner' },
  { id: 'phoenix-fire', name: 'Phoenix Flare', icon: '🔥', requiredLevel: 12, description: 'Resilient flame-powered mythic craft' }
];

export const TITLE_OPTIONS = [
  { id: 'Rookie Racer', name: 'Rookie Racer', minRating: 1000 },
  { id: 'Key Explorer', name: 'Key Explorer', minRating: 1100 },
  { id: 'Pace Setter', name: 'Pace Setter', minRating: 1250 },
  { id: 'Speed Artisan', name: 'Speed Artisan', minRating: 1400 },
  { id: 'Unicode Striker', name: 'Unicode Striker', minRating: 1600 },
  { id: 'Himalayan Bullet', name: 'Himalayan Bullet', minRating: 1800 },
  { id: 'Grandmaster Typist', name: 'Grandmaster Typist', minRating: 2000 },
  { id: 'Arena Legend', name: 'Arena Legend', minRating: 2200 }
];

export const BOT_ARCHETYPES = [
  { id: 'bot-beginner', name: 'Aarav (Beginner Bot)', avatar: '🤖', minWpm: 20, maxWpm: 26, accuracy: 88, tier: 'Easy' },
  { id: 'bot-novice', name: 'Pooja (Novice Bot)', avatar: '👾', minWpm: 30, maxWpm: 37, accuracy: 91, tier: 'Normal' },
  { id: 'bot-intermediate', name: 'Bikash (Speedster Bot)', avatar: '⚡', minWpm: 42, maxWpm: 52, accuracy: 93, tier: 'Normal' },
  { id: 'bot-advanced', name: 'Suman (Aero Bot)', avatar: '🚀', minWpm: 56, maxWpm: 66, accuracy: 95, tier: 'Hard' },
  { id: 'bot-expert', name: 'Nisha (Apex Bot)', avatar: '🦅', minWpm: 72, maxWpm: 86, accuracy: 97, tier: 'Expert' },
  { id: 'bot-master', name: 'Kiran (Titan Bot)', avatar: '🔥', minWpm: 92, maxWpm: 108, accuracy: 98, tier: 'Master' },
  { id: 'bot-legend', name: 'Vajra (Godspeed Bot)', avatar: '👑', minWpm: 112, maxWpm: 128, accuracy: 99, tier: 'Legend' }
];

export const CAREER_LEVELS: CareerLevel[] = [
  {
    levelNumber: 1,
    tierName: 'Rookie',
    title: 'Level 1: Foundation Circuit',
    iconName: 'Flag',
    minLevelToUnlock: 1,
    stages: [
      {
        id: 'c1-s1',
        stageNumber: 1,
        title: 'Ignition Lap',
        description: 'Warm up your fingers on clean, fundamental phrases.',
        targetWpm: 20,
        targetAccuracy: 85,
        textNepali: 'namaste nepal ma mero desh lai dherai maya garchhu',
        textEnglish: 'the quick brown fox jumps over the lazy dog and runs away fast',
        xpReward: 150
      },
      {
        id: 'c1-s2',
        stageNumber: 2,
        title: 'Straightaway Sprint',
        description: 'Maintain steady rhythm without looking down at the keys.',
        targetWpm: 24,
        targetAccuracy: 88,
        textNepali: 'hami sabai jana milera desh ko bikas garnu parchha',
        textEnglish: 'simple daily practice builds muscle memory and consistent typing speed',
        xpReward: 180
      },
      {
        id: 'c1-s3',
        stageNumber: 3,
        title: 'Cornering Control',
        description: 'Master transitions between vowels and consonants.',
        targetWpm: 28,
        targetAccuracy: 90,
        textNepali: 'kathmandu nepal ko sundar rajdhani sahar ho jaha dherai sanskriti chha',
        textEnglish: 'focus on accuracy first before pushing for high speed and rapid fingers',
        xpReward: 220
      },
      {
        id: 'c1-s4',
        stageNumber: 4,
        title: 'Rookie License Qualifier',
        description: 'Final test of Level 1. Achieve 30 WPM with 92% precision.',
        targetWpm: 30,
        targetAccuracy: 92,
        textNepali: 'gyan ra shiksha le manis lai safal banaunchha ra samaj ma astitwa dinchha',
        textEnglish: 'every keystroke brings you closer to effortless touch typing mastery',
        xpReward: 300
      }
    ]
  },
  {
    levelNumber: 2,
    tierName: 'Learner',
    title: 'Level 2: Speed Induction',
    iconName: 'Zap',
    minLevelToUnlock: 2,
    stages: [
      {
        id: 'c2-s1',
        stageNumber: 1,
        title: 'Cadence Builder',
        description: 'Keep your keystrokes flowing at a steady BPM.',
        targetWpm: 32,
        targetAccuracy: 90,
        textNepali: 'samaya ko sahik sadupayog garnu parne hamro thulo kartabya ho',
        textEnglish: 'consistency in typing rhythm produces far higher net speed and fewer errors',
        xpReward: 250
      },
      {
        id: 'c2-s2',
        stageNumber: 2,
        title: 'Double Vowel Drifts',
        description: 'Swiftly execute matras and repeated syllables.',
        targetWpm: 35,
        targetAccuracy: 91,
        textNepali: 'prakriti le nepal lai sundar himal nadiya ra hariyo jangal diye ko chha',
        textEnglish: 'smooth transitions between letters ensure high typing endurance over time',
        xpReward: 280
      },
      {
        id: 'c2-s3',
        stageNumber: 3,
        title: 'Precision Braking',
        description: 'Eliminate hesitation when handling longer multi-syllable terms.',
        targetWpm: 38,
        targetAccuracy: 92,
        textNepali: 'samajik sadbhav ra ekata le matra rastriya unnati sambhav hunchha',
        textEnglish: 'reading two words ahead allows your hands to prepare fluid combinations',
        xpReward: 320
      },
      {
        id: 'c2-s4',
        stageNumber: 4,
        title: 'Learner Apex Match',
        description: 'Qualify for Level 3 with a 40 WPM sprint.',
        targetWpm: 40,
        targetAccuracy: 93,
        textNepali: 'adhikari ra nagarik bich ko vishwas le shasan byabastha baliyo hunchha',
        textEnglish: 'the greatest typists maintain calm posture and precise tactile feedback',
        xpReward: 400
      }
    ]
  },
  {
    levelNumber: 3,
    tierName: 'Typist',
    title: 'Level 3: Flow Velocity',
    iconName: 'Gauge',
    minLevelToUnlock: 3,
    stages: [
      {
        id: 'c3-s1',
        stageNumber: 1,
        title: 'Shift Gear Drive',
        description: 'Handle capitalized Roman inputs and key conjuncts cleanly.',
        targetWpm: 42,
        targetAccuracy: 92,
        textNepali: 'nepali bhasha ko lipi devanagari ho jasle gauravamay itihas bokeko chha',
        textEnglish: 'modern typing efficiency is an indispensable skill in today digital workplace',
        xpReward: 350
      },
      {
        id: 'c3-s2',
        stageNumber: 2,
        title: 'Punctuation Chicanes',
        description: 'Seamless integration of commas, periods, and sentence boundaries.',
        targetWpm: 45,
        targetAccuracy: 93,
        textNepali: 'parishram bina safalata pauna sakidaina, tehi bhaera nirantar prayas garnu parchha.',
        textEnglish: 'dedication, proper finger placement, and daily drills unlock true keyboard fluency.',
        xpReward: 380
      },
      {
        id: 'c3-s3',
        stageNumber: 3,
        title: 'Rapid Transliteration',
        description: 'Instantly convert complex word endings (garchhan, bhayeka).',
        targetWpm: 48,
        targetAccuracy: 94,
        textNepali: 'loktantra ma janta nai sarvochha shakti sampanna hunchhan ra unko aawaj prathamikta ho.',
        textEnglish: 'accuracy shields your combo and propels your vehicle ahead of aggressive opponents.',
        xpReward: 420
      },
      {
        id: 'c3-s4',
        stageNumber: 4,
        title: 'Typist Crown Qualifier',
        description: 'Hit 50 WPM with at least 94% accuracy to earn your Level 3 badge.',
        targetWpm: 50,
        targetAccuracy: 94,
        textNepali: 'prabidhi ko bikas sangai aaja ko yug ma computer typing ati aavashyak banyeko chha.',
        textEnglish: 'reaching fifty words per minute represents the gateway to professional productivity.',
        xpReward: 500
      }
    ]
  },
  {
    levelNumber: 4,
    tierName: 'Speedster',
    title: 'Level 4: Nitro Acceleration',
    iconName: 'Flame',
    minLevelToUnlock: 4,
    stages: [
      {
        id: 'c4-s1',
        stageNumber: 1,
        title: 'Turbine Launch',
        description: 'High burst velocity through common conversational phrases.',
        targetWpm: 54,
        targetAccuracy: 93,
        textNepali: 'nepal ko samvidhan le sabai nagarik lai saman hak ra swatantrata pradan gareko chha.',
        textEnglish: 'fast fingers alone are insufficient without disciplined mental focus and calm breath.',
        xpReward: 450
      },
      {
        id: 'c4-s2',
        stageNumber: 2,
        title: 'Sustained Overdrive',
        description: 'Maintain speed through extended multi-paragraph structures.',
        targetWpm: 58,
        targetAccuracy: 94,
        textNepali: 'rastriya aarthik samriddhi ko lagi krishi, paryatan ra jalvidyut kshetra mahatwapurna chhan.',
        textEnglish: 'mastering peripheral keyboard reach eliminates wasted hand motions and micro delays.',
        xpReward: 500
      },
      {
        id: 'c4-s3',
        stageNumber: 3,
        title: 'Half-Letter Velocity',
        description: 'Rapid execution of Devanagari halanta (k, ch, stha, ddh).',
        targetWpm: 62,
        targetAccuracy: 95,
        textNepali: 'shreshtha pradarshan garna lai pratibaddha ra dridha sankalpa ko aavashyakta hunchha.',
        textEnglish: 'competitive typing demands rapid visual recognition and instantaneous muscular response.',
        xpReward: 550
      },
      {
        id: 'c4-s4',
        stageNumber: 4,
        title: 'Speedster Trophy Trial',
        description: 'Break into the 65 WPM tier with 95% precision.',
        targetWpm: 65,
        targetAccuracy: 95,
        textNepali: 'nyayapalika le kanun ko sashan ra samvidhan ko maryada raksha garne mukhya jimma linchha.',
        textEnglish: 'achieving sixty-five words per minute places you within the top ten percent of worldwide typists.',
        xpReward: 650
      }
    ]
  },
  {
    levelNumber: 5,
    tierName: 'Advanced',
    title: 'Level 5: Precision Circuit',
    iconName: 'Target',
    minLevelToUnlock: 5,
    stages: [
      {
        id: 'c5-s1',
        stageNumber: 1,
        title: 'Legal Terminology Sprint',
        description: 'Lok Sewa and official constitutional phrases.',
        targetWpm: 68,
        targetAccuracy: 95,
        textNepali: 'punaravedan adalat le prastut misil ra praman ko aadhar ma aadesh jari gareko chha.',
        textEnglish: 'advanced typists navigate complex legal terminology and multi-syllabic vocabulary effortlessly.',
        xpReward: 600
      },
      {
        id: 'c5-s2',
        stageNumber: 2,
        title: 'Zero-Hesitation Flow',
        description: 'Continuous typing without any pause between words.',
        targetWpm: 72,
        targetAccuracy: 96,
        textNepali: 'sarvajanik kharid prakriya ma pardarshita ra uttardayitva kaayam garnu aavashyak chha.',
        textEnglish: 'rhythmic perfection is maintained when every keystroke occurs at mathematically balanced intervals.',
        xpReward: 700
      },
      {
        id: 'c5-s3',
        stageNumber: 3,
        title: 'Complex Conjuncts Trial',
        description: 'Execute Tra, Gya, Ksha, and Shra without breaking tempo.',
        targetWpm: 75,
        targetAccuracy: 96,
        textNepali: 'shiksha ra srijanatmakta le manav sabhyata lai uchha sthar ma puryaucha.',
        textEnglish: 'fluid typing across complex symbols and punctuation sets elite operators apart from novices.',
        xpReward: 800
      },
      {
        id: 'c5-s4',
        stageNumber: 4,
        title: 'Advanced Master Qualifier',
        description: 'Reach 80 WPM with 96% accuracy.',
        targetWpm: 80,
        targetAccuracy: 96,
        textNepali: 'prashasanik kshamata bridhi garna nirantar prashikshan ra naya prabidhi ko aavashyakta hunchha.',
        textEnglish: 'eighty words per minute with ninety-six percent accuracy commands respect in any competitive arena.',
        xpReward: 1000
      }
    ]
  },
  {
    levelNumber: 6,
    tierName: 'Expert',
    title: 'Level 6: Apex Grand Prix',
    iconName: 'Award',
    minLevelToUnlock: 6,
    stages: [
      {
        id: 'c6-s1',
        stageNumber: 1,
        title: 'Supersonic Sprint',
        description: 'Elite speed execution with zero room for error.',
        targetWpm: 84,
        targetAccuracy: 96,
        textNepali: 'aadhunik suchana prabidhi ko prayog le sarkari sewa pravaha lai chhito ra chharito banayeko chha.',
        textEnglish: 'expert typing requires total cognitive synchronization between sight reading and kinetic finger action.',
        xpReward: 900
      },
      {
        id: 'c6-s2',
        stageNumber: 2,
        title: 'High-Velocity Technical Words',
        description: 'Rapid transliteration of technological and administrative vocab.',
        targetWpm: 88,
        targetAccuracy: 96,
        textNepali: 'digital rupantaran le sansar bhari ka manisharu lai ek aapas ma jodna thulo maddat gareko chha.',
        textEnglish: 'unbroken focus transforms difficult symbol combinations into rapid automatic reflex patterns.',
        xpReward: 1050
      },
      {
        id: 'c6-s3',
        stageNumber: 3,
        title: 'Grand Prix Qualifier',
        description: '90 WPM barrier test.',
        targetWpm: 92,
        targetAccuracy: 97,
        textNepali: 'samrachanagat sudhar ra susashan le matra aarthik bridhi lai dirghakalin banauna sakinchha.',
        textEnglish: 'racing past ninety words per minute unlocks blistering velocity while maintaining surgical precision.',
        xpReward: 1200
      },
      {
        id: 'c6-s4',
        stageNumber: 4,
        title: 'Expert Championship Belt',
        description: '95 WPM with 97% accuracy required.',
        targetWpm: 95,
        targetAccuracy: 97,
        textNepali: 'swatantra ra nispakshya nirwachan le loktantrik pranali lai baliyo ra vishwasniya banaunchha.',
        textEnglish: 'the expert class demands exceptional stamina, laser focus, and mastery of all keyboard quadrants.',
        xpReward: 1500
      }
    ]
  },
  {
    levelNumber: 7,
    tierName: 'Pro',
    title: 'Level 7: Hyper Velocity',
    iconName: 'Crosshair',
    minLevelToUnlock: 7,
    stages: [
      {
        id: 'c7-s1',
        stageNumber: 1,
        title: 'Century Threshold',
        description: 'Push beyond 98 WPM on technical paragraphs.',
        targetWpm: 98,
        targetAccuracy: 97,
        textNepali: 'buddhibal ra mehanat ko samyojan le asambhav lagne kaam pani sahajai pura garna sakinchha.',
        textEnglish: 'approaching triple-digit typing velocity requires featherlight key actuation and zero wasted tension.',
        xpReward: 1300
      },
      {
        id: 'c7-s2',
        stageNumber: 2,
        title: '100 WPM Barrier Break',
        description: 'Break the historic 100 WPM barrier with strict precision.',
        targetWpm: 100,
        targetAccuracy: 97,
        textNepali: 'rastriya gaurav ka aayojana samaya mai sampanna garna kshyematapurna byawasthapan aavashyak hunchha.',
        textEnglish: 'breaking one hundred words per minute is a milestone achieved by only the top one percent of typists.',
        xpReward: 1600
      },
      {
        id: 'c7-s3',
        stageNumber: 3,
        title: 'Hyper Stream Cadence',
        description: 'Sustain triple digits through high frequency transitions.',
        targetWpm: 104,
        targetAccuracy: 97,
        textNepali: 'antarastriya manak anusar ka kushal karmachari le pratyek kshetra ma shreshtha parinam nikalchhan.',
        textEnglish: 'pure muscle memory carries your thoughts directly onto the screen with instantaneous execution.',
        xpReward: 1800
      },
      {
        id: 'c7-s4',
        stageNumber: 4,
        title: 'Pro Apex Trophy',
        description: 'Conquer 108 WPM at 98% accuracy.',
        targetWpm: 108,
        targetAccuracy: 98,
        textNepali: 'shakti ra prayas ko purna sadupayog garda manav kshamata ko sima lai naya uchaai ma puryauna sakinchha.',
        textEnglish: 'pro-tier operators deliver impeccable accuracy under immense time pressure and competitive stress.',
        xpReward: 2200
      }
    ]
  },
  {
    levelNumber: 8,
    tierName: 'Master',
    title: 'Level 8: Master Tier',
    iconName: 'Crown',
    minLevelToUnlock: 8,
    stages: [
      {
        id: 'c8-s1',
        stageNumber: 1,
        title: 'Mach 1 Lap',
        description: '110 WPM target on Devanagari / English passages.',
        targetWpm: 110,
        targetAccuracy: 97,
        textNepali: 'darshanshastra ra vigyan ko milan le samaj ma naya drishtikon ra chetana ko vikas gareko chha.',
        textEnglish: 'mastery is the state where conscious thought merges seamlessly into automated kinetic finger dance.',
        xpReward: 2000
      },
      {
        id: 'c8-s2',
        stageNumber: 2,
        title: 'Master Harmonic Rhythm',
        description: '114 WPM with near-zero backspaces.',
        targetWpm: 114,
        targetAccuracy: 98,
        textNepali: 'pratibha ra abhyas le manish lai sadhai agadi badhaunchha ra prashansha ko patra banaucha.',
        textEnglish: 'every character registers crisply as your keyboard hums in perfect continuous harmonic rhythm.',
        xpReward: 2400
      },
      {
        id: 'c8-s3',
        stageNumber: 3,
        title: 'Titan Sprint',
        description: '118 WPM high-stakes sprint.',
        targetWpm: 118,
        targetAccuracy: 98,
        textNepali: 'susanskritik samaj nirman ma pratyek nagarik ko sakriya sahavagita ati mahatwapurna hunchha.',
        textEnglish: 'blistering tempo meets surgical accuracy to outpace the most formidable competitive AI algorithms.',
        xpReward: 2800
      },
      {
        id: 'c8-s4',
        stageNumber: 4,
        title: 'Master Grand Crest',
        description: '120 WPM with 98% accuracy.',
        targetWpm: 120,
        targetAccuracy: 98,
        textNepali: 'uchha astitwa ra kshyamata ko praman tehi ho jasle kathin paristhiti ma pani shreshthatwa dekhaucha.',
        textEnglish: 'achieving one hundred and twenty words per minute solidifies your standing as a true keyboard master.',
        xpReward: 3500
      }
    ]
  },
  {
    levelNumber: 9,
    tierName: 'Champion',
    title: 'Level 9: Champion Circuit',
    iconName: 'ShieldAlert',
    minLevelToUnlock: 9,
    stages: [
      {
        id: 'c9-s1',
        stageNumber: 1,
        title: 'Lightning Storm',
        description: '122 WPM with 98% accuracy threshold.',
        targetWpm: 122,
        targetAccuracy: 98,
        textNepali: 'aagami pusta ko lagi sundar ra samriddha nepal nirman garnu hamro sarvochha kartabya ho.',
        textEnglish: 'champion racers unleash lightning speed without ever dropping below ninety-eight percent accuracy.',
        xpReward: 3000
      },
      {
        id: 'c9-s2',
        stageNumber: 2,
        title: 'Vortex Sprint',
        description: '125 WPM target on intense legal & literary prose.',
        targetWpm: 125,
        targetAccuracy: 98,
        textNepali: 'kanun ko saman samrakshan ra manav adhikar ko purna maryada nai sabhyata ko mul aadhar ho.',
        textEnglish: 'the keyboard becomes an extension of the human nervous system firing signals at unmatched speed.',
        xpReward: 3600
      },
      {
        id: 'c9-s3',
        stageNumber: 3,
        title: 'Apex Crown Sprint',
        description: '128 WPM on complex vocabulary.',
        targetWpm: 128,
        targetAccuracy: 98,
        textNepali: 'swatantrata, samata ra bhratritwa le yug yug samma manav jati lai prerana pradan garirahane chhan.',
        textEnglish: 'unwavering composure allows champion typists to maintain breakneck speed through dense prose.',
        xpReward: 4200
      },
      {
        id: 'c9-s4',
        stageNumber: 4,
        title: 'Champion World Qualifier',
        description: 'Hit 130 WPM with 98.5% precision to enter the Hall of Legends.',
        targetWpm: 130,
        targetAccuracy: 98.5,
        textNepali: 'druta gati ra shuddhata ko anupam sangam le matra pratham sthan surakshit garna sakinchha.',
        textEnglish: 'one hundred and thirty words per minute marks the threshold between championship form and mythical status.',
        xpReward: 5000
      }
    ]
  },
  {
    levelNumber: 10,
    tierName: 'Legend',
    title: 'Level 10: Hall of Legends',
    iconName: 'Sparkles',
    minLevelToUnlock: 10,
    stages: [
      {
        id: 'c10-s1',
        stageNumber: 1,
        title: 'Vajra Strike',
        description: '132 WPM on high-difficulty text.',
        targetWpm: 132,
        targetAccuracy: 99,
        textNepali: 'sarvochha kshamata ko pradarshan gari itihas rachne bela aayeko chha nirbhay bhaera agadi badha.',
        textEnglish: 'legendary speed demands flawless execution where every microsecond is optimized to pure perfection.',
        xpReward: 5000
      },
      {
        id: 'c10-s2',
        stageNumber: 2,
        title: 'Sonic Barrier Blast',
        description: '135 WPM on multi-clause sentences.',
        targetWpm: 135,
        targetAccuracy: 99,
        textNepali: 'pratyek sabda ra pratyek akshar ma purna shuddhata kaayam gardai vijay ko jhanda gaada.',
        textEnglish: 'the sound of your keys resonates like thunder as you obliterate the limits of human typing speed.',
        xpReward: 6000
      },
      {
        id: 'c10-s3',
        stageNumber: 3,
        title: 'Everest Apex Trial',
        description: '138 WPM on constitutional and technical synthesis.',
        targetWpm: 138,
        targetAccuracy: 99,
        textNepali: 'sagarmartha ko sikhar jastai uchha manobal liera tapai le sansar lai aafno shakti dekhaisakeko chha.',
        textEnglish: 'standing atop the typing mountain, you reign supreme with infallible speed and immaculate precision.',
        xpReward: 7500
      },
      {
        id: 'c10-s4',
        stageNumber: 4,
        title: 'Godspeed: The Final Trial',
        description: 'The Ultimate Career Challenge: 140 WPM at 99% accuracy!',
        targetWpm: 140,
        targetAccuracy: 99,
        textNepali: 'ananta ananta samma tapai ko naam typist ko itihas ma amar rahane chha tapai sachhai mahan hunuhunchha.',
        textEnglish: 'you have conquered the typing universe, transcended mortal limits, and etched your legacy forever as a true Typing God.',
        xpReward: 10000
      }
    ]
  }
];

export const BOSS_CHALLENGES: BossChallenge[] = [
  {
    id: 'boss-1',
    bossNumber: 1,
    name: 'Lexicon Golem',
    subtitle: 'The Vocabulary Behemoth',
    description: 'A monster forged from rare, polysyllabic, tongue-twisting words. Test your endurance against complex character clusters.',
    avatarIcon: '🗿',
    health: 100,
    modifier: 'Difficult Words & Multi-syllables',
    targetWpm: 40,
    minAccuracy: 90,
    timeLimitSeconds: 60,
    textNepali: 'prajatantrik samrachana aakasmik punarabhyas aarthik durdarshita swatantrata karyakram',
    textEnglish: 'quintessential juxtaposition serendipity idiosyncrasy kaleidoscope insurmountable chlorophyll',
    xpReward: 600,
    badgeReward: 'Golem Crusher'
  },
  {
    id: 'boss-2',
    bossNumber: 2,
    name: 'Punctuation Phantom',
    subtitle: 'The Chicane Spectre',
    description: 'Lurks within tricky sentence structures with semicolons, dashes, apostrophes, quotation marks, and commas.',
    avatarIcon: '👻',
    health: 100,
    modifier: 'Punctuation & Syntax Maze',
    targetWpm: 45,
    minAccuracy: 92,
    timeLimitSeconds: 60,
    textNepali: 'nepal, hamro desh: "sundar, shanta ra vishal chha;" tara bikas garnu parchha.',
    textEnglish: 'Speed—without accuracy—is futile; therefore, practice "daily," maintain focus, and succeed!',
    xpReward: 800,
    badgeReward: 'Syntax Exorcist'
  },
  {
    id: 'boss-3',
    bossNumber: 3,
    name: 'Cipher Dragon',
    subtitle: 'The Numeric Wyrm',
    description: 'Spews sequences of numbers, currency markers, percentages, and special symbols (#, $, %, &, *).',
    avatarIcon: '🐲',
    health: 100,
    modifier: 'Numbers & Symbols Overdrive',
    targetWpm: 40,
    minAccuracy: 92,
    timeLimitSeconds: 65,
    textNepali: 'barsa 2081 ma nepal ko budget 1860 arba rupaiya thiyo; 75% kharcha vayo.',
    textEnglish: 'In 2026, revenue increased by +45.8% ($1,250,000 USD) across 89 distinct regional sectors & 12 hubs.',
    xpReward: 1000,
    badgeReward: 'Cipher Slayer'
  },
  {
    id: 'boss-4',
    bossNumber: 4,
    name: 'Unicode Titan',
    subtitle: 'The Half-Letter Colossus',
    description: 'Devours typists who stumble on Devanagari halanta, conjuncts (ज्ञ, त्र, क्ष, श्र), and complex matras.',
    avatarIcon: '⚡',
    health: 100,
    modifier: 'Heavy Half-Letters & Conjuncts',
    targetWpm: 50,
    minAccuracy: 93,
    timeLimitSeconds: 70,
    textNepali: 'shreshtha gyan, dridha sankalpa, samrakshan, prashasanik kshyamata ra antardrishti aavashyak chha.',
    textEnglish: 'touch typing complex glyphs and orthographic transitions requires unwavering muscle memory.',
    xpReward: 1400,
    badgeReward: 'Unicode Sovereign'
  },
  {
    id: 'boss-5',
    bossNumber: 5,
    name: 'Jurisprudence Sphinx',
    subtitle: 'The Legal Overlord',
    description: 'Enforces strict constitutional, court, and parliamentary legal phraseology from Supreme Court gazettes.',
    avatarIcon: '⚖️',
    health: 100,
    modifier: 'Strict Legal & Constitutional Jargon',
    targetWpm: 58,
    minAccuracy: 95,
    timeLimitSeconds: 75,
    textNepali: 'sammananiya pradhan nyayadhish jyu ko ijlas bata habeas corpus ko aadesh jari bhaeko chha.',
    textEnglish: 'the supreme court ruled that procedural due process and constitutional equity must be upheld without exception.',
    xpReward: 2000,
    badgeReward: 'Jurist Conqueror'
  },
  {
    id: 'boss-6',
    bossNumber: 6,
    name: 'Chronos: The Grand Archon',
    subtitle: 'The Final Boss of Typing Arena',
    description: 'The supreme ruler of speed and precision. Requires 70+ WPM with a merciless 98% accuracy gate!',
    avatarIcon: '👑',
    health: 100,
    modifier: 'The Grand Trial (Strict 98% Accuracy)',
    targetWpm: 70,
    minAccuracy: 98,
    timeLimitSeconds: 80,
    textNepali: 'samagra manav sabhyata ko srijana, gyan ko ananta sagar ra shreshthatwa ko yatra ma aaja tapai le sarvochha vijay prapta garnu bhaeko chha.',
    textEnglish: 'transcending the boundaries of mortal speed, you have conquered the grand trial of chronos, sealing your immortal name in the celestial hall of legends forever.',
    xpReward: 4000,
    badgeReward: 'Archon Vanquisher'
  }
];

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first_race', title: 'First Race', description: 'Complete your first race in Typing Arena.', category: 'races', icon: '🏁', maxProgress: 1, xpReward: 100, tier: 'bronze' },
  { id: 'speedster_30', title: 'Pace Setter', description: 'Reach 30 WPM in any race.', category: 'speed', icon: '⚡', maxProgress: 30, xpReward: 150, tier: 'bronze' },
  { id: 'speedster_50', title: 'Speedster', description: 'Reach 50 WPM in any race.', category: 'speed', icon: '🏎️', maxProgress: 50, xpReward: 300, tier: 'silver' },
  { id: 'speedster_75', title: 'Apex Predator', description: 'Reach 75 WPM in any race.', category: 'speed', icon: '🚀', maxProgress: 75, xpReward: 600, tier: 'gold' },
  { id: 'speedster_100', title: 'The 100 Club', description: 'Surpass 100 WPM in any verified race.', category: 'speed', icon: '💨', maxProgress: 100, xpReward: 1500, tier: 'diamond' },
  { id: 'precision_95', title: 'Sharpshooter', description: 'Complete a race with at least 95% accuracy.', category: 'accuracy', icon: '🎯', maxProgress: 1, xpReward: 200, tier: 'bronze' },
  { id: 'precision_99', title: 'Precision Master', description: 'Complete a race with 99% or higher accuracy.', category: 'accuracy', icon: '💎', maxProgress: 1, xpReward: 800, tier: 'diamond' },
  { id: 'combo_50', title: 'Combo Novice', description: 'Achieve a 50-keystroke flawless combo.', category: 'streak', icon: '🔥', maxProgress: 50, xpReward: 250, tier: 'silver' },
  { id: 'combo_100', title: 'Combo God', description: 'Achieve a 100-keystroke flawless combo.', category: 'streak', icon: '⚡', maxProgress: 100, xpReward: 1000, tier: 'diamond' },
  { id: 'career_l3', title: 'Career Trainee', description: 'Complete all stages in Career Level 3.', category: 'career', icon: '📜', maxProgress: 3, xpReward: 400, tier: 'bronze' },
  { id: 'career_l7', title: 'Pro Typist', description: 'Complete all stages in Career Level 7.', category: 'career', icon: '🏅', maxProgress: 7, xpReward: 1200, tier: 'gold' },
  { id: 'career_l10', title: 'Career Legend', description: 'Conquer all 10 Career Levels.', category: 'career', icon: '👑', maxProgress: 10, xpReward: 3000, tier: 'diamond' },
  { id: 'boss_1', title: 'Golem Slayer', description: 'Defeat Boss 1 (Lexicon Golem).', category: 'mastery', icon: '🗿', maxProgress: 1, xpReward: 500, tier: 'bronze' },
  { id: 'boss_3', title: 'Cipher Breaker', description: 'Defeat Boss 3 (Cipher Dragon).', category: 'mastery', icon: '🐲', maxProgress: 1, xpReward: 900, tier: 'silver' },
  { id: 'boss_6', title: 'Archon Vanquisher', description: 'Defeat the Final Boss (Chronos).', category: 'mastery', icon: '👑', maxProgress: 1, xpReward: 2500, tier: 'diamond' },
  { id: 'races_10', title: 'Track Enthusiast', description: 'Complete 10 total races.', category: 'races', icon: '🏎', maxProgress: 10, xpReward: 300, tier: 'bronze' },
  { id: 'races_50', title: 'Veteran Racer', description: 'Complete 50 total races.', category: 'races', icon: '🏆', maxProgress: 50, xpReward: 1000, tier: 'gold' },
  { id: 'wins_10', title: 'Champion Contender', description: 'Win 10 races against AI or players.', category: 'races', icon: '🥇', maxProgress: 10, xpReward: 500, tier: 'silver' },
  { id: 'wins_25', title: 'Victory Laurels', description: 'Win 25 races in the Arena.', category: 'races', icon: '🎖️', maxProgress: 25, xpReward: 1200, tier: 'gold' },
  { id: 'rank_gold', title: 'Golden Typist', description: 'Reach Gold rank in Competitive Ranked.', category: 'mastery', icon: '🥇', maxProgress: 1, xpReward: 600, tier: 'silver' },
  { id: 'rank_diamond', title: 'Diamond Operator', description: 'Reach Diamond rank in Competitive Ranked.', category: 'mastery', icon: '💎', maxProgress: 1, xpReward: 1500, tier: 'gold' },
  { id: 'rank_legend', title: 'Living Legend', description: 'Attain the prestigious Legend rank.', category: 'mastery', icon: '🌟', maxProgress: 1, xpReward: 5000, tier: 'diamond' },
  { id: 'daily_streak_3', title: 'Consistent Mind', description: 'Maintain a 3-day daily challenge streak.', category: 'streak', icon: '📅', maxProgress: 3, xpReward: 300, tier: 'bronze' },
  { id: 'daily_streak_7', title: 'Weekly Devotee', description: 'Maintain a 7-day daily challenge streak.', category: 'streak', icon: '🔥', maxProgress: 7, xpReward: 1000, tier: 'gold' },
  { id: 'nepali_master', title: 'Unicode Maestro', description: 'Score 60+ WPM in a Nepali race.', category: 'mastery', icon: '🇳🇵', maxProgress: 1, xpReward: 1000, tier: 'gold' }
];

export const MOCK_GLOBAL_LEADERBOARD: ArenaLeaderboardEntry[] = [
  { rank: 1, playerName: 'Subhash (You)', avatar: '🏎️', country: 'NP', wpm: 78, accuracy: 98.2, rating: 1740, tier: 'Diamond', division: 'II', wins: 42, isCurrentUser: true },
  { rank: 2, playerName: 'Aayush Karki', avatar: '🚀', country: 'NP', wpm: 88, accuracy: 97.8, rating: 1950, tier: 'Master', division: 'I', wins: 89 },
  { rank: 3, playerName: 'Pooja Shrestha', avatar: '🦅', country: 'NP', wpm: 82, accuracy: 98.6, rating: 1820, tier: 'Diamond', division: 'I', wins: 64 },
  { rank: 4, playerName: 'Devon Walker', avatar: '⚡', country: 'US', wpm: 80, accuracy: 96.9, rating: 1780, tier: 'Diamond', division: 'II', wins: 55 },
  { rank: 5, playerName: 'Anil Gurung', avatar: '🚙', country: 'NP', wpm: 74, accuracy: 97.1, rating: 1640, tier: 'Platinum', division: 'I', wins: 38 },
  { rank: 6, playerName: 'Priya Sharma', avatar: '👑', country: 'IN', wpm: 71, accuracy: 96.4, rating: 1590, tier: 'Platinum', division: 'II', wins: 31 },
  { rank: 7, playerName: 'Rohan Thapa', avatar: '🏎', country: 'NP', wpm: 68, accuracy: 95.8, rating: 1510, tier: 'Platinum', division: 'III', wins: 27 },
  { rank: 8, playerName: 'Elena Rostova', avatar: '🔥', country: 'CA', wpm: 65, accuracy: 96.2, rating: 1460, tier: 'Gold', division: 'I', wins: 22 },
  { rank: 9, playerName: 'Suman Adhikari', avatar: '👾', country: 'NP', wpm: 62, accuracy: 95.0, rating: 1390, tier: 'Gold', division: 'II', wins: 19 },
  { rank: 10, playerName: 'Liam O\'Connor', avatar: '🤖', country: 'UK', wpm: 59, accuracy: 94.6, rating: 1320, tier: 'Gold', division: 'III', wins: 15 }
];

export const MOCK_NEPALI_LEADERBOARD: ArenaLeaderboardEntry[] = [
  { rank: 1, playerName: 'Aayush Karki', avatar: '🚀', country: 'NP', wpm: 72, accuracy: 98.4, rating: 1890, tier: 'Master', division: 'II', wins: 67 },
  { rank: 2, playerName: 'Subhash (You)', avatar: '🏎️', country: 'NP', wpm: 68, accuracy: 97.9, rating: 1740, tier: 'Diamond', division: 'II', wins: 42, isCurrentUser: true },
  { rank: 3, playerName: 'Pooja Shrestha', avatar: '🦅', country: 'NP', wpm: 65, accuracy: 98.1, rating: 1680, tier: 'Platinum', division: 'I', wins: 45 },
  { rank: 4, playerName: 'Bikash Mahat', avatar: '⚡', country: 'NP', wpm: 61, accuracy: 96.5, rating: 1540, tier: 'Platinum', division: 'II', wins: 33 },
  { rank: 5, playerName: 'Sita Gautam', avatar: '👑', country: 'NP', wpm: 58, accuracy: 97.0, rating: 1470, tier: 'Gold', division: 'I', wins: 26 },
  { rank: 6, playerName: 'Deepak Bhandari', avatar: '🚙', country: 'NP', wpm: 54, accuracy: 95.3, rating: 1380, tier: 'Gold', division: 'II', wins: 18 }
];

export const DAILY_CHALLENGE_TEXTS = {
  nepali: [
    'nepal ko aitihasik ra sanskritik sampada le hamro muluk lai sansar ma astitwaban banayeko chha. pratyek nagarik le aafno kartabya pura garda matra samajik sadbhav ra unnati sambhav hunchha.',
    'prabidhi ra internet ko yug ma suchana prabidhi ko gyan ati aavashyak banyeko chha. aafno dhyan ra dridha sankalpa le tapai le pratyek kathin kaam ma safalata pauna saknuhunchha.',
    'samaj ma susashan ra nyaya sthapana garnu sarvochha dhyeya ho. imaandari ra parishram le nai manish lai samajik samman ra aadar dilaunchha.'
  ],
  english: [
    'The pursuit of mastery demands consistent daily dedication, clear mental clarity, and surgical tactile precision. Every keystroke is an opportunity to refine your touch typing discipline.',
    'Technological acceleration continues to reshape our world at unprecedented velocity. Those who cultivate deep digital communication fluency navigate the modern era with effortless grace.',
    'Great champions are not born overnight; they are forged through thousands of deliberate repetitions, learning from every minor mistake and steadily refining their kinetic focus.'
  ]
};

export const QUICK_RACE_TEXTS = {
  nepali: [
    'namaste nepal, sundar himal ra hariyo tarai ko hamro pyaro desh ma tapai lai swagat chha.',
    'shiksha nai manav jiban ko sabai bhanda mulyavan dhan ho jasle ujyalo bhavishya nirman garchha.',
    'parishram ra mehanat le asambhav lai pani sambhav banaucha ra unnati ko marga kholcha.',
    'loktantrik paddhati ma janta ko aawaj nai sarvochha shakti ho ra kanun ko rajya sthapit hunchha.',
    'aadhunik sansar ma computer ra internet ko prayog bina kunai pani kshetra aadhunik banna sakdaina.'
  ],
  english: [
    'The quick brown fox jumps over the lazy dog while racing towards the ultimate championship finish line.',
    'Typing speed combined with strict accuracy produces unparalleled productivity in the digital workspace.',
    'Maintain a calm posture, keep your wrists elevated, and allow rhythm to guide your fingers smoothly.',
    'Mastering the home row keys provides the foundational anchor for effortless full-keyboard velocity.',
    'Continuous focus and quick reaction time enable competitive racers to surge ahead of any rival bot.'
  ]
};

export function getTierFromRating(rating: number): { tier: CompetitiveTier; division: CompetitiveDivision } {
  if (rating < 1100) return { tier: 'Bronze', division: rating < 1030 ? 'III' : rating < 1070 ? 'II' : 'I' };
  if (rating < 1250) return { tier: 'Silver', division: rating < 1150 ? 'III' : rating < 1200 ? 'II' : 'I' };
  if (rating < 1450) return { tier: 'Gold', division: rating < 1310 ? 'III' : rating < 1380 ? 'II' : 'I' };
  if (rating < 1700) return { tier: 'Platinum', division: rating < 1530 ? 'III' : rating < 1610 ? 'II' : 'I' };
  if (rating < 1950) return { tier: 'Diamond', division: rating < 1780 ? 'III' : rating < 1860 ? 'II' : 'I' };
  if (rating < 2200) return { tier: 'Master', division: rating < 2030 ? 'III' : rating < 2110 ? 'II' : 'I' };
  if (rating < 2400) return { tier: 'Grandmaster', division: 'I' };
  return { tier: 'Legend', division: 'I' };
}

export function calculateXpForNextLevel(level: number): number {
  return Math.round(300 * Math.pow(1.22, level - 1));
}
