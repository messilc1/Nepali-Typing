/**
 * Intelligent Romanized Nepali Unicode Transliteration Engine
 * Compatible with Google Input Tools / Hamro Keyboard Romanized typing style
 */

import { stripInvisibleCharacters, normalizeTypography, isCharacterEquivalent, areDevanagariWordsEquivalent } from './textNormalizer';

// Dictionary for high-accuracy standard words & legal/constitutional vocabulary
export const COMMON_DICTIONARY: Record<string, string> = {
  // Greetings & Pronouns
  namaste: 'नमस्ते',
  namaskar: 'नमस्कार',
  ma: 'म',
  mero: 'मेरो',
  mera: 'मेरा',
  meri: 'मेरी',
  timi: 'तिमी',
  timro: 'तिम्रो',
  tapai: 'तपाईं',
  tapaiko: 'तपाईंको',
  u: 'ऊ',
  usko: 'उसको',
  hami: 'हामी',
  hamro: 'हाम्रो',
  uniharu: 'उनीहरू',
  tinigharu: 'तिनीहरू',

  // Common Nouns & Verbs
  ghar: 'घर',
  sahar: 'शहर',
  desh: 'देश',
  rashtra: 'राष्ट्र',
  nepal: 'नेपाल',
  nepali: 'नेपाली',
  bhasha: 'भाषा',
  shiksha: 'शिक्षा',
  gyan: 'ज्ञान',
  kaam: 'काम',
  kaaryalaya: 'कार्यालय',
  samaya: 'समय',
  din: 'दिन',
  raat: 'रात',
  pani: 'पानी',
  khanak: 'खाना',
  aaja: 'आज',
  bholipor: 'भोलि',
  bholi: 'भोलि',
  hijo: 'हिजो',
  murchha: 'मूर्छा',
  chha: 'छ',
  chhan: 'छन्',
  ho: 'हो',
  hainan: 'हैनन्',
  hoina: 'होइन',
  bhayeko: 'भएको',
  garne: 'गर्ने',
  gareko: 'गरेको',
  hudai: 'हुँदै',
  garnu: 'गर्नु',

  // Legal & Constitutional Vocabulary (Lok Sewa & Judiciary)
  sammananiya: 'सम्माननीय',
  sarbochcha: 'सर्वोच्च',
  adalatko: 'अदालतको',
  aadesh: 'आदेश',
  samvidhan: 'संविधान',
  sanvidhan: 'संविधान',
  samvidhanko: 'संविधानको',
  kanoon: 'कानून',
  kanun: 'कानून',
  nyaya: 'न्याय',
  nyayadhish: 'न्यायाधीश',
  adalat: 'अदालत',
  sarkar: 'सरकार',
  adhikar: 'अधिकार',
  adhikarko: 'अधिकारको',
  nivedan: 'निवेदन',
  nivedak: 'निवेदक',
  nivedanma: 'निवेदनमा',
  faisala: 'फैसला',
  faisla: 'फैसला',
  faisalako: 'फैसलाको',
  punaravedan: 'पुनरावेदन',
  nyayik: 'न्यायिक',
  sanghiya: 'संघीय',
  pradesh: 'प्रदेश',
  sthaniya: 'स्थानीय',
  mahanYayadhivakta: 'महान्यायाधिवक्ता',
  mahanyayadhivakta: 'महान्यायाधिवक्ता',
  vidheyak: 'विधेयक',
  niyamavali: 'नियमावली',
  ain: 'ऐन',
  dafa: 'दफा',
  upadafa: 'उपदफा',
  samjhauta: 'सम्झौता',
  rit: 'रिट',
  antarim: 'अन्तरिम',
  praman: 'प्रमाण',
  bahas: 'बहस',
  misil: 'मिसिल',
  tarikh: 'तारिख',
  prativadi: 'प्रतिवादी',
  badi: 'वादी',
  sabha: 'सभा',
  pratinidhisabha: 'प्रतिनिधिसभा',
  rashtriyasabha: 'राष्ट्रियसभा',
  sambaidhanik: 'संवैधानिक',
  prajati: 'प्रजातन्त्र',
  loktantra: 'लोकतन्त्र',
  ganatantra: 'गणतन्त्र',
  sadhai: 'सधैं',
  kartavya: 'कर्तव्य',
  nagarik: 'नागरिक',
  karyapalika: 'कार्यपालिका',
  vyavasthapika: 'व्यवस्थापिका',
  nyayapalika: 'न्यायपालिका',
  nepalko: 'नेपालको',
  bhag: 'भाग',
  maulik: 'मौलिक',
  hak: 'हक',
  hakko: 'हकको',
  dhara: 'धारा',
  sammanpurvak: 'सम्मानपूर्वक',
  banchna: 'बाँच्न',
  paune: 'पाउने',
  hunechha: 'हुनेछ',
  kasailai: 'कसैलाई',
  mrityudandako: 'मृत्युदण्डको',
  sajaya: 'सजाय',
  dine: 'दिने',
  gari: 'गरी',
  banaine: 'बनाइने',
  chhain: 'छैन',
  bamojim: 'बमोजिम',
  baheka: 'बाहेक',
  kunai: 'कुनै',
  vyaktilai: 'व्यक्तिलाई',
  vaiyaktik: 'वैयक्तिक',
  svatantratabata: 'स्वतन्त्रताबाट',
  vanchhit: 'वञ्चित',
  garine: 'गरिने',
  vichar: 'विचार',
  abhivyaktiko: 'अभिव्यक्तिको',
  bina: 'बिना',
  hatahatiyar: 'हातहतियार',
  shantipurvak: 'शान्तिपूर्वक',
  bhela: 'भेला',
  sangh: 'संघ',
  sanstha: 'संस्था',
  kholne: 'खोल्ने',
  sanrakshan: 'संरक्षण',
  manch: 'मञ्च',
  viruddha: 'विरुद्ध',
  pratyarthi: 'प्रत्यर्थी',
  pradhanmantri: 'प्रधानमन्त्री',
  tatha: 'तथा',
  mantriparishadko: 'मन्त्रिपरिषद्को',
  byahora: 'व्यहोरा',
  upadhara: 'उपधारा',
  utpreshan: 'उत्प्रेषण',
  paramadeshko: 'परमादेशको',
  jari: 'जारी',

  garipaum: 'गरिपाऊँ',
  bhanne: 'भन्ने',
  sunuwai: 'सुनुवाइ',
  hunda: 'हुँदा',
  prachalanma: 'प्रचलनमा',
  kisimko: 'किसिमको',
  anuchit: 'अनुचित',
  bandej: 'बन्देज',
  lagauna: 'लगाउन',
  namilne: 'नमिल्ने',
  sarvabhaumasattasampanna: 'सार्वभौमसत्तासम्पन्न',
  jantako: 'जनताको',
  surakshit: 'सुरक्षित',
  rakhnu: 'राख्नु',
  rajyako: 'राज्यको',
  anibarya: 'अनिवार्य',
  thaharcha: 'ठहर्छ',

  // Numbers & Miscellaneous
  ek: 'एक',
  dui: 'दुई',
  teen: 'तीन',
  chaar: 'चार',
  paanch: 'पाँच',
  chha_num: 'छ',
  saat: 'सात',
  aath: 'आठ',
  nau: 'नौ',
  das: 'दस',
  say: 'सय',
  hajar: 'हजार',
};

// Character Mappings
const VOWELS: Record<string, string> = {
  a: 'अ',
  aa: 'आ',
  A: 'आ',
  i: 'इ',
  ee: 'ई',
  I: 'ई',
  u: 'उ',
  oo: 'ऊ',
  U: 'ऊ',
  e: 'ए',
  ai: 'ऐ',
  o: 'ओ',
  au: 'औ',
  ou: 'औ',
  ri: 'ऋ',
  am: 'अं',
  ah: 'अः',
};

const VOWEL_MATRAS: Record<string, string> = {
  aa: 'ा',
  A: 'ा',
  i: 'ि',
  ee: 'ी',
  I: 'ी',
  u: 'ु',
  oo: 'ू',
  U: 'ू',
  e: 'े',
  ai: 'ै',
  o: 'ो',
  au: 'ौ',
  ou: 'ौ',
  ri: 'ृ',
};

// Consonants list sorted by string length descending to match longest substring first
const CONSONANT_ENTRIES: [string, string][] = [
  ['chhh', 'छ'],
  ['ksh', 'क्ष'],
  ['shr', 'श्र'],
  ['chh', 'छ'],
  ['kh', 'ख'],
  ['gh', 'घ'],
  ['ng', 'ङ'],
  ['ch', 'च'],
  ['jh', 'झ'],
  ['yn', 'ञ'],
  ['Th', 'ठ'],
  ['Dh', 'ढ'],
  ['th', 'थ'],
  ['dh', 'ध'],
  ['ph', 'फ'],
  ['bh', 'भ'],
  ['sh', 'श'],
  ['Sh', 'ष'],
  ['gy', 'ज्ञ'],
  ['tr', 'त्र'],
  ['k', 'क'],
  ['g', 'ग'],
  ['j', 'ज'],
  ['T', 'ट'],
  ['D', 'ड'],
  ['N', 'ण'],
  ['t', 'त'],
  ['d', 'द'],
  ['n', 'न'],
  ['p', 'प'],
  ['f', 'फ'],
  ['b', 'ब'],
  ['m', 'म'],
  ['y', 'य'],
  ['r', 'र'],
  ['l', 'ल'],
  ['w', 'व'],
  ['v', 'व'],
  ['s', 'स'],
  ['h', 'ह'],
];

const NUMBERS: Record<string, string> = {
  '0': '०',
  '1': '१',
  '2': '२',
  '3': '३',
  '4': '४',
  '5': '५',
  '6': '६',
  '7': '७',
  '8': '८',
  '9': '९',
};

// Common Nepali case and plural suffixes
const SUFFIX_MAP: [string, string][] = [
  ['harulai', 'हरूलाई'],
  ['haruko', 'हरूको'],
  ['haruma', 'हरूमा'],
  ['harule', 'हरूले'],
  ['haru', 'हरू'],
  ['bata', 'बाट'],
  ['sanga', 'सँग'],
  ['lai', 'लाई'],
  ['maa', 'मा'],
  ['ma', 'मा'],
  ['ko', 'को'],
  ['kaa', 'का'],
  ['ka', 'का'],
  ['ki', 'की'],
  ['le', 'ले'],
  ['dekhi', 'देखि'],
  ['dvara', 'द्वारा'],
  ['chha', 'छ'],
  ['chhan', 'छन्'],
  ['bhayeko', 'भएको'],
];

const REVERSE_SUFFIX_MAP: [string, string][] = [
  ['हरूलाई', 'harulai'],
  ['हरूको', 'haruko'],
  ['हरूमा', 'haruma'],
  ['हरूले', 'harule'],
  ['हरू', 'haru'],
  ['बाट', 'bata'],
  ['सँग', 'sanga'],
  ['लाई', 'lai'],
  ['मा', 'ma'],
  ['को', 'ko'],
  ['का', 'ka'],
  ['की', 'ki'],
  ['ले', 'le'],
  ['देखि', 'dekhi'],
  ['द्वारा', 'dvara'],
  ['छन्', 'chhan'],
  ['छ', 'chha'],
];

/**
 * Rules-based transliteration from Romanized English to Devanagari Unicode
 */
export function transliterateWordRuleBased(roman: string): string {
  if (!roman) return '';

  const sanitized = stripInvisibleCharacters(roman);

  // Extract leading and trailing punctuation
  const prefixMatch = sanitized.match(/^[।,!\?:;"'\(\)\[\]\{\}\.\-\—\<\>\/]+/);
  const leadingPunct = prefixMatch ? prefixMatch[0] : '';
  const suffixMatch = sanitized.match(/[।,!\?:;"'\(\)\[\]\{\}\.\-\—\<\>\/]+$/);
  const trailingPunct = suffixMatch ? suffixMatch[0] : '';

  const core = sanitized.substring(
    leadingPunct.length,
    sanitized.length - (trailingPunct ? trailingPunct.length : 0)
  ).trim();

  const convertPunct = (p: string) => {
    return p.replace(/\./g, '।').replace(/\|/g, '।');
  };

  if (!core) {
    return convertPunct(sanitized);
  }

  const clean = core.toLowerCase();
  
  // Direct dictionary match
  if (COMMON_DICTIONARY[clean]) {
    return convertPunct(leadingPunct) + COMMON_DICTIONARY[clean] + convertPunct(trailingPunct);
  }
  if (COMMON_DICTIONARY[core]) {
    return convertPunct(leadingPunct) + COMMON_DICTIONARY[core] + convertPunct(trailingPunct);
  }

  // Compound stem + suffix match (e.g. "nepalko" -> "nepal" + "ko")
  for (const [sufRoman, sufDev] of SUFFIX_MAP) {
    if (clean.endsWith(sufRoman) && clean.length > sufRoman.length) {
      const stem = clean.substring(0, clean.length - sufRoman.length);
      if (COMMON_DICTIONARY[stem]) {
        return convertPunct(leadingPunct) + COMMON_DICTIONARY[stem] + sufDev + convertPunct(trailingPunct);
      }
    }
  }

  let result = '';
  let i = 0;
  const n = clean.length;

  while (i < n) {
    const char = clean[i];

    // Numbers
    if (NUMBERS[char]) {
      result += NUMBERS[char];
      i++;
      continue;
    }

    // Punctuation / whitespace / special chars
    if (!/[a-zA-Z]/.test(char)) {
      if (char === '~') {
        result += 'ँ';
      } else if (char === ':') {
        result += 'ः';
      } else if (char === '.' || char === '|') {
        result += '।';
      } else {
        result += char;
      }
      i++;
      continue;
    }

    // Check for Consonant match (try longest matching key)
    let matchedConsonant: string | null = null;
    let matchedLen = 0;

    for (const [key, devanagari] of CONSONANT_ENTRIES) {
      if (clean.substring(i, i + key.length) === key.toLowerCase()) {
        matchedConsonant = devanagari;
        matchedLen = key.length;
        break;
      }
    }

    if (matchedConsonant) {
      result += matchedConsonant;
      i += matchedLen;

      // Now inspect what follows the consonant
      if (i >= n) {
        // End of word consonant without explicit vowel -> append halant (्)
        result += '्';
        break;
      }

      // Check for vowel matra following consonant
      const rest = clean.substring(i);
      let matchedMatra: string | null = null;
      let matraLen = 0;

      // Check 2-char matras first (aa, ee, oo, ai, au, ou, ri)
      const twoChar = rest.substring(0, 2);
      if (VOWEL_MATRAS[twoChar]) {
        matchedMatra = VOWEL_MATRAS[twoChar];
        matraLen = 2;
      } else if (rest[0] === 'a') {
        // 'a' gives full vowel sound to consonant (removes halant), no visible matra sign
        matchedMatra = '';
        matraLen = 1;
      } else if (VOWEL_MATRAS[rest[0]]) {
        matchedMatra = VOWEL_MATRAS[rest[0]];
        matraLen = 1;
      }

      if (matchedMatra !== null) {
        result += matchedMatra;
        i += matraLen;

        // Check for anusvara (m or n followed by consonant/end) or chandrabindu
        if (i < n && (clean[i] === '~')) {
          result += 'ँ';
          i++;
        }
      } else {
        // Next character is another consonant or non-vowel -> halant (halant creates half-letter/conjunct)
        result += '्';
      }

      continue;
    }

    // If not consonant, check for independent vowel at start or after vowel/space
    let matchedVowel: string | null = null;
    let vowelLen = 0;

    const twoCharVowel = clean.substring(i, i + 2);
    if (VOWELS[twoCharVowel]) {
      matchedVowel = VOWELS[twoCharVowel];
      vowelLen = 2;
    } else if (VOWELS[char]) {
      matchedVowel = VOWELS[char];
      vowelLen = 1;
    }

    if (matchedVowel) {
      result += matchedVowel;
      i += vowelLen;
      continue;
    }

    // Fallback: append raw character
    result += char;
    i++;
  }

  return convertPunct(leadingPunct) + result + convertPunct(trailingPunct);
}


/**
 * Transliterates an entire string (sentence or paragraph) word by word or token by token
 */
export function transliterateRomanToNepali(text: string): string {
  if (!text) return '';

  // Split keeping spaces and punctuation delimiters intact
  const tokens = text.split(/([ \n\t\.,!\?:;"'\(\)\[\]\{\}।])/);

  return tokens
    .map((token) => {
      if (/^[a-zA-Z~:]+$/.test(token)) {
        return transliterateWordRuleBased(token);
      }
      return token;
    })
    .join('');
}

/**
 * Returns top candidate word suggestions for a given Romanized input
 */
export function getWordSuggestions(romanWord: string): string[] {
  const clean = romanWord.trim().toLowerCase();
  if (!clean) return [];

  const suggestions: string[] = [];

  // Direct dictionary hit
  if (COMMON_DICTIONARY[clean]) {
    suggestions.push(COMMON_DICTIONARY[clean]);
  }

  // Rule based conversion
  const ruleConverted = transliterateWordRuleBased(clean);
  if (!suggestions.includes(ruleConverted)) {
    suggestions.push(ruleConverted);
  }

  // Fuzzy matches from dictionary
  const keys = Object.keys(COMMON_DICTIONARY);
  for (const k of keys) {
    if (k !== clean && (k.startsWith(clean) || clean.startsWith(k))) {
      const val = COMMON_DICTIONARY[k];
      if (!suggestions.includes(val)) {
        suggestions.push(val);
        if (suggestions.length >= 4) break;
      }
    }
  }

  return suggestions;
}

// Build reverse dictionary for fast 100% accurate lookups
export const REVERSE_DICTIONARY: Record<string, string> = {};
Object.entries(COMMON_DICTIONARY).forEach(([roman, devanagari]) => {
  if (!REVERSE_DICTIONARY[devanagari]) {
    REVERSE_DICTIONARY[devanagari] = roman;
  }
});

export const DEVANAGARI_CONSONANTS: Record<string, string> = {
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
  'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'yn',
  'ट': 'T', 'ठ': 'Th', 'ड': 'D', 'ढ': 'Dh', 'ण': 'N',
  'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
  'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'Sh', 'स': 's', 'ह': 'h',
  'क्ष': 'ksh', 'त्र': 'tr', 'ज्ञ': 'gy', 'श्र': 'shr',
  'त्त': 'tt', 'द्ध': 'ddh', 'द्य': 'dy', 'द्घ': 'dgh', 'द्ब': 'db', 'द्द': 'dd', 'द्भ': 'dbh',
  'ष्ट्र': 'shtra', 'ष्ट': 'sht', 'ष्ठ': 'shth', 'न्द्द': 'ndd', 'ङ्क': 'nk', 'ङ्ग': 'ng', 'ञ्च': 'nch', 'ञ्ज': 'nj'
};

export const DEVANAGARI_INDEPENDENT_VOWELS: Record<string, string> = {
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'ऋ': 'ri', 'अं': 'am', 'अः': 'ah'
};

export const DEVANAGARI_VOWEL_MATRAS: Record<string, string> = {
  'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ृ': 'ri', 'ँ': '~', 'ं': 'm', 'ः': ':'
};

/**
 * Returns the exact English Romanized key sequence required to produce a given Nepali/Devanagari word.
 */
export function getRomanizedHintForWord(word: string): string {
  if (!word) return '';

  const sanitized = stripInvisibleCharacters(word);

  // Extract leading and trailing punctuation
  const prefixMatch = sanitized.match(/^[।,!\?:;"'\(\)\[\]\{\}\.\-\—\<\>\/]+/);
  const leadingPunct = prefixMatch ? prefixMatch[0] : '';
  const suffixMatch = sanitized.match(/[।,!\?:;"'\(\)\[\]\{\}\.\-\—\<\>\/]+$/);
  const trailingPunct = suffixMatch ? suffixMatch[0] : '';

  const clean = sanitized.substring(
    leadingPunct.length,
    sanitized.length - (trailingPunct ? trailingPunct.length : 0)
  ).trim();

  // If already English text, return as-is lowercase with punctuation
  if (!clean || /^[a-zA-Z0-9]+$/.test(clean)) {
    return leadingPunct + (clean ? clean.toLowerCase() : '') + (trailingPunct === '।' ? '.' : trailingPunct);
  }

  // Check reverse dictionary first
  let coreResult = '';
  if (REVERSE_DICTIONARY[clean]) {
    coreResult = REVERSE_DICTIONARY[clean];
  } else {
    // Check reverse suffix match (e.g. "नेपालको" -> "nepal" + "ko")
    let suffixMatched = false;
    for (const [sufDev, sufRoman] of REVERSE_SUFFIX_MAP) {
      if (clean.endsWith(sufDev) && clean.length > sufDev.length) {
        const stem = clean.substring(0, clean.length - sufDev.length);
        if (REVERSE_DICTIONARY[stem]) {
          coreResult = REVERSE_DICTIONARY[stem] + sufRoman;
          suffixMatched = true;
          break;
        }
      }
    }

    if (!suffixMatched) {
      let result = '';
      let i = 0;
      const n = clean.length;

      while (i < n) {
        const char = clean[i];

        // Numbers
        if (/[०-९]/.test(char)) {
          const numMap: Record<string, string> = { '०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9' };
          result += numMap[char] || char;
          i++;
          continue;
        }

        // Check for 3-char and 2-char conjuncts
        const threeChar = clean.substring(i, i + 3);
        const twoChar = clean.substring(i, i + 2);
        let matchedConsonant: string | null = null;
        let matchedLen = 0;

        if (DEVANAGARI_CONSONANTS[threeChar]) {
          matchedConsonant = DEVANAGARI_CONSONANTS[threeChar];
          matchedLen = 3;
        } else if (DEVANAGARI_CONSONANTS[twoChar]) {
          matchedConsonant = DEVANAGARI_CONSONANTS[twoChar];
          matchedLen = 2;
        } else if (DEVANAGARI_CONSONANTS[char]) {
          matchedConsonant = DEVANAGARI_CONSONANTS[char];
          matchedLen = 1;
        }

        if (matchedConsonant) {
          result += matchedConsonant;
          i += matchedLen;

          if (i < n) {
            const nextChar = clean[i];
            if (nextChar === '्') {
              // Halant: explicit no vowel following consonant
              i++;
            } else if (DEVANAGARI_VOWEL_MATRAS[nextChar]) {
              result += DEVANAGARI_VOWEL_MATRAS[nextChar];
              i++;
            } else {
              // Inherent 'a' vowel if followed by another consonant or end of word
              if (i < n && !/[।,!\?:;"'\(\)\[\]\{\}\.\-\—\<\>\/\s]/.test(nextChar)) {
                result += 'a';
              }
            }
          }
          continue;
        }

        // Independent Vowels
        if (DEVANAGARI_INDEPENDENT_VOWELS[char]) {
          result += DEVANAGARI_INDEPENDENT_VOWELS[char];
          i++;
          continue;
        }

        // Matra
        if (DEVANAGARI_VOWEL_MATRAS[char]) {
          result += DEVANAGARI_VOWEL_MATRAS[char];
          i++;
          continue;
        }

        result += char;
        i++;
      }
      coreResult = result;
    }
  }

  const convertedTrailingPunct = trailingPunct === '।' ? '.' : trailingPunct;
  const convertedLeadingPunct = leadingPunct === '।' ? '.' : leadingPunct;

  return convertedLeadingPunct + coreResult + convertedTrailingPunct;
}


