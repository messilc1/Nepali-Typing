/**
 * Intelligent Romanized Nepali Unicode Transliteration Engine
 * Compatible with Google Input Tools / Hamro Keyboard Romanized typing style
 */

// Dictionary for high-accuracy standard words & legal/constitutional vocabulary
const COMMON_DICTIONARY: Record<string, string> = {
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
  samvidhan: 'संविधान',
  sanvidhan: 'संविधान',
  kanoon: 'कानून',
  kanun: 'कानून',
  nyaya: 'न्याय',
  nyayadhish: 'न्यायाधीश',
  adalat: 'अदालत',
  sarkar: 'सरकार',
  adhikar: 'अधिकार',
  nivedan: 'निवेदन',
  faisala: 'फैसला',
  faisla: 'फैसला',
  punaravedan: 'पुनरावेदन',
  aadesh: 'आदेश',
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
   व्यवस्थापिका: 'व्यवस्थापिका',
  vyavasthapika: 'व्यवस्थापिका',
  nyayapalika: 'न्यायपालिका',

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

/**
 * Rules-based transliteration from Romanized English to Devanagari Unicode
 */
export function transliterateWordRuleBased(roman: string): string {
  if (!roman) return '';

  const clean = roman.trim().toLowerCase();
  if (COMMON_DICTIONARY[clean]) {
    return COMMON_DICTIONARY[clean];
  }
  if (COMMON_DICTIONARY[roman]) {
    return COMMON_DICTIONARY[roman];
  }

  let result = '';
  let i = 0;
  const n = roman.length;

  while (i < n) {
    const char = roman[i];

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
      if (roman.substring(i, i + key.length) === key) {
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
      const rest = roman.substring(i);
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
        if (i < n && (roman[i] === '~')) {
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

    const twoCharVowel = roman.substring(i, i + 2);
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

  return result;
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
