export interface NepaliPracticeCategory {
  id: string;
  name: string;
  nepaliName: string;
  description: string;
  difficulty: 'Beginner' | 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
  subCategories: NepaliPracticeSubCategory[];
}

export interface NepaliPracticeSubCategory {
  id: string;
  name: string;
  nepaliName: string;
  description: string;
  items: string[];
  romanHints?: Record<string, string>;
}

export const NEPALI_PRACTICE_DATA: NepaliPracticeCategory[] = [
  // 1. CHARACTER PRACTICE (वर्ण अभ्यास)
  {
    id: 'basic-characters',
    name: 'Character Practice',
    nepaliName: 'आधारभूत वर्ण अभ्यास',
    description: 'Master individual Devanagari vowels, consonants, and standard Romanized Unicode key mappings.',
    difficulty: 'Beginner',
    subCategories: [
      {
        id: 'vowels',
        name: 'Devanagari Vowels (स्वर वर्ण)',
        nepaliName: 'स्वर वर्ण (१३ वटा आधारभूत)',
        description: 'Practice all independent Devanagari vowels (अ देखि अः सम्म) with precise Romanized keystroke mappings.',
        items: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'],
        romanHints: {
          'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee / I', 'उ': 'u', 'ऊ': 'oo / U',
          'ऋ': 'ri / R', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'am / an', 'अः': 'ah / H'
        }
      },
      {
        id: 'consonants-k-ch',
        name: 'Consonants: Ka & Cha Groups (क-वर्ग र च-वर्ग)',
        nepaliName: 'क-वर्ग र च-वर्ग (१० वर्णहरू)',
        description: 'Velar and Palatal consonants: क, ख, ग, घ, ङ, च, छ, ज, झ, ञ.',
        items: ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ'],
        romanHints: {
          'क': 'k', 'ख': 'kh / K', 'ग': 'g', 'घ': 'gh / G', 'ङ': 'ng',
          'च': 'ch / c', 'छ': 'chh / C', 'ज': 'j', 'झ': 'jh / J', 'ञ': 'yn / N'
        }
      },
      {
        id: 'consonants-t-t',
        name: 'Consonants: Retroflex Ta & Dental Ta Groups (ट-वर्ग र त-वर्ग)',
        nepaliName: 'ट-वर्ग र त-वर्ग (१० वर्णहरू)',
        description: 'Retroflex and Dental consonants: ट, ठ, ड, ढ, ण, त, थ, द, ध, न.',
        items: ['ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न'],
        romanHints: {
          'ट': 'T', 'ठ': 'Th', 'ड': 'D', 'ढ': 'Dh', 'ण': 'N',
          'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n'
        }
      },
      {
        id: 'consonants-p-h',
        name: 'Consonants: Pa, Ya & Sa Groups (प देखि ह सम्म)',
        nepaliName: 'प-वर्ग, य-वर्ग, स-वर्ग र ह (१३ वर्णहरू)',
        description: 'Labial, semivowel, sibilant, and aspirate consonants: प, फ, ब, भ, म, य, र, ल, व, श, ष, स, ह.',
        items: ['प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह'],
        romanHints: {
          'प': 'p', 'फ': 'ph / f / P', 'ब': 'b', 'भ': 'bh / B', 'म': 'm',
          'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'w / v', 'श': 'sh / S', 'ष': 'Sh', 'स': 's', 'ह': 'h'
        }
      },
      {
        id: 'common-char-combinations',
        name: 'Common Character Combinations (सामान्य वर्ण संयोजन)',
        nepaliName: 'सामान्य वर्ण संयोजन तथा आधा अक्षर',
        description: 'Frequent Devanagari half-letters and double letter sequences.',
        items: [
          'क्क', 'ख', 'ग्ग', 'च्च', 'ज्ज', 'ट्ट', 'ड्ड', 'त्त', 'त्थ', 'द्द', 'द्ध',
          'न्न', 'प्प', 'ब्ब', 'म्म', 'ल्ल', 'स्स', 'क्य', 'ग्य', 'त्य', 'द्य', 'प्य', 'ब्य', 'म्य', 'स्य', 'ह्य'
        ],
        romanHints: {
          'क्क': 'kka', 'च्च': 'chcha', 'ट्ट': 'TTa', 'त्त': 'tta', 'न्न': 'nna', 'म्म': 'mma', 'ल्ल': 'lla', 'स्स': 'ssa'
        }
      }
    ]
  },

  // 2. MATRA PRACTICE (मात्रा अभ्यास)
  {
    id: 'matras-drill',
    name: 'Matra Practice',
    nepaliName: 'मात्रा अभ्यास',
    description: 'Learn and master vowel signs (ा, ि, ी, ु, ू, े, ै, ो, ौ, ृ, ं, ँ, ः, ्) across diverse consonants.',
    difficulty: 'Basic',
    subCategories: [
      {
        id: 'matra-aakar-ikar',
        name: 'Aakar (ा) & Ikar (ि / ी)',
        nepaliName: 'आकार (ा) र ह्रस्व/दीर्घ इकार (ि/ी)',
        description: 'Practice attaching aakar and short/long ikar across various consonants.',
        items: [
          'का', 'कि', 'की', 'खा', 'खि', 'खी', 'गा', 'गि', 'गी', 'घा', 'घि', 'घी',
          'चा', 'चि', 'ची', 'छा', 'छि', 'छी', 'जा', 'जि', 'जी', 'झा', 'झि', 'झी',
          'टा', 'टि', 'टी', 'ठा', 'ठि', 'ठी', 'डा', 'डि', 'डी', 'ढा', 'ढि', 'ढी',
          'ता', 'ति', 'ती', 'था', 'थि', 'थी', 'दा', 'दि', 'दी', 'धा', 'धि', 'धी',
          'ना', 'नि', 'नी', 'पा', 'पि', 'पी', 'फा', 'फि', 'फी', 'बा', 'बि', 'बी',
          'भा', 'भि', 'भी', 'मा', 'मि', 'मी', 'या', 'यि', 'यी', 'रा', 'रि', 'री',
          'ला', 'लि', 'ली', 'वा', 'वि', 'वी', 'शा', 'शि', 'शी', 'षा', 'षि', 'षी',
          'सा', 'सि', 'सी', 'हा', 'हि', 'ही'
        ]
      },
      {
        id: 'matra-ukar-ekar',
        name: 'Ukar (ु / ू) & Ekar / Aikar (े / ै)',
        nepaliName: 'ह्रस्व/दीर्घ उकार (ु/ू) र एकार/ऐकार (े/ै)',
        description: 'Practice short/long ukar and single/double ekar with consonants.',
        items: [
          'कु', 'कू', 'के', 'कै', 'खु', 'खू', 'खे', 'खै',
          'गु', 'गू', 'गे', 'गै', 'घु', 'घू', 'घे', 'घै',
          'चु', 'चू', 'चे', 'चै', 'छु', 'छू', 'छे', 'छै',
          'जु', 'जू', 'जे', 'जै', 'झु', 'झू', 'झे', 'झै',
          'टु', 'टू', 'टे', 'टै', 'ठु', 'ठू', 'ठे', 'ठै',
          'तु', 'तू', 'ते', 'तै', 'थु', 'थू', 'थे', 'थै',
          'दु', 'दू', 'दे', 'दै', 'धु', 'धू', 'धे', 'धै',
          'नु', 'न्यू', 'ने', 'नै', 'पु', 'पू', 'पे', 'पै',
          'फु', 'फू', 'फे', 'फै', 'बु', 'बू', 'बे', 'बै',
          'भु', 'भू', 'भे', 'भै', 'मु', 'मू', 'मे', 'मै',
          'यु', 'यू', 'ये', 'यै', 'रु', 'रू', 'रे', 'रै',
          'लु', 'लू', 'ले', 'लै', 'वु', 'वू', 'वे', 'वै',
          'शु', 'शू', 'शे', 'शै', 'षु', 'षू', 'षे', 'षै',
          'सु', 'सू', 'से', 'सै', 'हु', 'हू', 'हे', 'है'
        ]
      },
      {
        id: 'matra-okar-rikar',
        name: 'Okar (ो / ौ) & Rikar (ृ)',
        nepaliName: 'ओकार (ो/ौ) र ऋकार (ृ)',
        description: 'Practice okar, aukar, and vocalic rikar (ृ) combinations.',
        items: [
          'को', 'कौ', 'कृ', 'खो', 'खौ', 'खृ', 'गो', 'गौ', 'गृ', 'घो', 'घौ', 'घृ',
          'चो', 'चौ', 'चृ', 'छो', 'छौ', 'छृ', 'जो', 'जौ', 'जृ', 'झो', 'झौ', 'झृ',
          'टो', 'टौ', 'टृ', 'ठो', 'ठौ', 'ठृ', 'डो', 'डौ', 'डृ', 'ढो', 'ढौ', 'ढृ',
          'तो', 'तौ', 'तृ', 'थो', 'थौ', 'थृ', 'दो', 'दौ', 'दृ', 'धो', 'धौ', 'धृ',
          'नो', 'नौ', 'नृ', 'पो', 'पौ', 'पृ', 'फो', 'फौ', 'फृ', 'बो', 'बौ', 'बृ',
          'भो', 'भौ', 'भृ', 'मो', 'मौ', 'मृ', 'यो', 'यौ', 'यृ', 'रो', 'रौ',
          'लो', 'लौ', 'लृ', 'वो', 'वौ', 'वृ', 'शो', 'शौ', 'शृ', 'षो', 'षौ', 'षृ',
          'सो', 'सौ', 'सृ', 'हो', 'हौ', 'हृ'
        ]
      },
      {
        id: 'matra-nasal-halant',
        name: 'Bindu (ं), Chandrabindu (ँ) & Halant (्)',
        nepaliName: 'शिरविन्दु (ं), चन्द्रविन्दु (ँ) र हलन्त (्)',
        description: 'Practice nasal diacritics, anusvara, and pure consonant halants.',
        items: [
          'कं', 'खं', 'गं', 'घं', 'चं', 'जं', 'तं', 'दं', 'पं', 'बं', 'मं', 'सं', 'हं',
          'काँ', 'खाँ', 'गाँ', 'घाँ', 'चाँ', 'छाँ', 'जाँ', 'ताँ', 'दाँ', 'पाँ', 'बाँ', 'माँ', 'साँ', 'हाँ',
          'गाउँ', 'ठाउँ', 'आँखा', 'बाँस', 'दाँत', 'गाँस', 'पाँच', 'काँडा', 'भ्वाङ', 'साँझ', 'हाँस', 'धुवाँ',
          'क्', 'ख्', 'ग्', 'घ्', 'ङ्', 'च्', 'छ्', 'ज्', 'झ्', 'ञ्',
          'ट्', 'ठ्', 'ड्', 'ढ्', 'ण्', 'त्', 'थ्', 'द्', 'ध्', 'न्',
          'प्', 'फ्', 'ब्', 'भ्', 'म्', 'य्', 'र्', 'ल्', 'व्', 'श्', 'ष्', 'स्', 'ह्'
        ]
      }
    ]
  },

  // 3. DIFFICULT CHARACTER PRACTICE (कठिन वर्ण तथा संयुक्त अक्षर अभ्यास)
  {
    id: 'difficult-characters',
    name: 'Difficult Character Practice',
    nepaliName: 'कठिन वर्ण तथा संयुक्त अक्षर अभ्यास',
    description: 'Master complex multi-character conjunct clusters, Sanskrit ligatures, and tricky Romanized sequences.',
    difficulty: 'Intermediate',
    subCategories: [
      {
        id: 'primary-conjuncts',
        name: 'Primary Conjuncts (क्ष, त्र, ज्ञ, श्र)',
        nepaliName: 'मुख्य संयुक्त वर्ण (क्ष, त्र, ज्ञ, श्र)',
        description: 'The four most fundamental compound Devanagari consonants and their vocabulary.',
        items: [
          'क्ष', 'त्र', 'ज्ञ', 'श्र', 'क्षेत्र', 'क्षमता', 'त्रिशूल', 'त्रिभुज',
          'ज्ञान', 'ज्ञानी', 'श्रम', 'श्रीमती', 'शिक्षा', 'पत्रिका', 'प्रतिज्ञा', 'आश्रम',
          'दक्ष', 'लक्षण', 'छात्र', 'मित्र', 'यज्ञ', 'विज्ञाप्ति', 'विश्राम', 'श्रमिक', 'साक्षरता'
        ],
        romanHints: {
          'क्ष': 'ksha / kshya', 'त्र': 'tra', 'ज्ञ': 'gya / jna', 'श्र': 'shra'
        }
      },
      {
        id: 'da-conjuncts',
        name: 'Da-Series Conjuncts (द्ध, द्व, द्य, द्र, दृ)',
        nepaliName: 'द-वर्गका संयुक्त वर्ण (द्ध, द्व, द्य, द्र, दृ)',
        description: 'Da ligature conjuncts frequently occurring in administrative, legal, and formal texts.',
        items: [
          'द्ध', 'द्व', 'द्य', 'द्र', 'दृ', 'युद्ध', 'प्रसिद्ध', 'वृद्धि', 'द्वन्द्व',
          'द्वितीय', 'द्वार', 'विद्या', 'विद्यार्थी', 'उद्यम', 'चन्द्र', 'समुद्र', 'रुद्राक्ष',
          'दृष्टि', 'दृश्य', 'दृढ', 'बुद्धि', 'शुद्ध', 'पद्य', 'गद्य', 'विद्वान', 'उद्देश्य'
        ]
      },
      {
        id: 'shta-shtra-conjuncts',
        name: 'Sh-Series & Tra Clusters (ष्ट, ष्ठ, ष्ट्र, न्द्र, ष्ण)',
        nepaliName: 'ष्ट, ष्ठ, ष्ट्र, न्द्र, ष्ण वर्ण समूह',
        description: 'Retroflex cluster conjuncts essential for typing official terms and state titles.',
        items: [
          'ष्ट', 'ष्ठ', 'ष्ट्र', 'न्द्र', 'ष्ण', 'दृष्टि', 'कष्ट', 'वरिष्ठ', 'श्रेष्ठ',
          'राष्ट्र', 'राष्ट्रिय', 'महाराष्ट्र', 'केन्द्र', 'केन्द्रीय', 'इन्द्र', 'महेन्द्र', 'नरेन्द्र',
          'उष्ण', 'कृष्ण', 'विष्णु', 'तृष्णा', 'प्रतिष्ठा', 'निष्ठुर', 'स्पष्ट', 'भ्रष्ट', 'उत्कृष्ट'
        ]
      },
      {
        id: 'ra-ref-prakar',
        name: 'Ra Variants: Reph (र्) & Rakar (्र)',
        nepaliName: 'रेफ (र्) र रकार (्र) अभ्यास',
        description: 'Master upper reph curves (कर्म, धर्म) and lower rakar slants (क्रम, प्रथम).',
        items: [
          'कर्म', 'धर्म', 'पर्व', 'वर्ष', 'सूर्य', 'कार्य', 'मार्ग', 'निर्णय', 'धैर्य', 'आश्चर्य',
          'क्रम', 'प्रकार', 'प्रथम', 'भ्रमण', 'ग्राम', 'श्रोता', 'वज्र', 'नम्र', 'तीव्र', 'सहस्र',
          'पुनर्जन्म', 'अर्थव्यवस्था', 'कर्तव्य', 'प्रक्रिया', 'प्रशासन', 'प्रगति', 'प्रतिक्रिया'
        ]
      },
      {
        id: 'unicode-tricky-sequences',
        name: 'Difficult Unicode Key Sequences (कठिन युनिकोड क्रम)',
        nepaliName: 'कठिन युनिकोड अनुक्रम (T, D, N, S, Sh, ri, om)',
        description: 'Specific keys with Romanized case differences (T vs t, D vs d, N vs n, Sh vs s).',
        items: [
          'टोपी', 'तोप', 'डमरू', 'दही', 'ठूलो', 'थोरै', 'ढुङ्गा', 'धनी',
          'बाण', 'बान', 'शान्ति', 'षड्यन्त्र', 'सत्य', 'ऋषि', 'ऋण', 'ऋतु',
          'ॐ', 'गङ्गा', 'अङ्क', 'सङ्ख्या', 'पञ्चायत', 'सञ्जय', 'सञ्चार', 'कण्ठ', 'दण्ड'
        ]
      }
    ]
  },

  // 4. WORD PRACTICE (शब्द अभ्यास)
  {
    id: 'word-practice',
    name: 'Word Practice',
    nepaliName: 'शब्द अभ्यास',
    description: 'Progressive vocabulary practice from 2-letter basic words to complex administrative terminology.',
    difficulty: 'Intermediate',
    subCategories: [
      {
        id: 'words-easy-23',
        name: 'Easy Nepali Words (२-३ अक्षरका सरल शब्दहरू)',
        nepaliName: '२-३ अक्षरका सरल शब्दहरू',
        description: 'Everyday words without complex conjuncts, ideal for initial speed building.',
        items: [
          'नेपाल', 'घर', 'काम', 'दिन', 'समय', 'पानी', 'खाना', 'मानिस', 'देश', 'भाषा',
          'जीवन', 'मित्र', 'ज्ञान', 'नाम', 'गाउँ', 'शहर', 'आकाश', 'फूल', 'रूख', 'बाटो',
          'कलम', 'आमा', 'बुबा', 'दाजु', 'दिदी', 'भाइ', 'बहिनी', 'साथी', 'किताब', 'मन',
          'रात', 'बिहान', 'बेलुका', 'घाम', 'जून', 'तारा', 'हावा', 'खोला', 'पहाड', 'हिमाल',
          'माया', 'सपना', 'खुशी', 'शान्ति', 'धर्म', 'सुख', 'दुःख', 'रङ', 'माटो', 'रुख'
        ]
      },
      {
        id: 'words-medium-matra',
        name: 'Medium Words (मात्रा र आधा अक्षर भएका शब्दहरू)',
        nepaliName: 'मध्यम शब्दहरू (मात्रा र आधा अक्षर)',
        description: 'Practical daily vocabulary with matras, bindu, and half letters.',
        items: [
          'संविधान', 'अधिकार', 'कानून', 'नागरिक', 'सरकार', 'शिक्षा', 'विकास', 'संस्कृति',
          'भविष्य', 'प्रविधि', 'विद्यार्थी', 'कार्यालय', 'व्यवसाय', 'समुदाय', 'स्वास्थ्य', 'उद्योग',
          'कृषि', 'पर्यटन', 'रोजगार', 'सहयोग', 'सञ्चार', 'पर्यावरण', 'संसार', 'सन्तुलन',
          'सफलता', 'प्रयास', 'अनुभव', 'प्रशिक्षण', 'मूल्यांकन', 'व्यवस्थापन', 'सहभागिता', 'विश्वसनीयता',
          'सद्भाव', 'समृद्धि', 'योगदान', 'कर्तव्य', 'इमान्दारी', 'प्रतिस्पर्धा', 'जिम्मेवारी'
        ]
      },
      {
        id: 'words-advanced-admin',
        name: 'Difficult / Long Administrative Words (प्रशासनिक तथा लोक सेवा शब्दावली)',
        nepaliName: 'प्रशासनिक तथा लोक सेवा शब्दावली',
        description: 'High-frequency official vocabulary used in government offices and competitive exams.',
        items: [
          'व्यवस्थापिका', 'कार्यपालिका', 'न्यायपालिका', 'प्रजातन्त्र', 'लोकतन्त्र', 'महान्यायाधिवक्ता',
          'महानिर्देशक', 'सम्झौता', 'पुनरावेदन', 'अधिकारक्षेत्र', 'संवैधानिक', 'उत्तरदायित्व',
          'सार्वभौमसत्ता', 'स्वायत्तता', 'विकेन्द्रीकरण', 'प्रतिनिधिसभा', 'राष्ट्रियसभा', 'प्रमाणपत्र',
          'अनुमोदन', 'कार्यान्वयन', 'प्रतिवेदन', 'समीक्षा', 'अभिलेख', 'पदाधिकारी', 'कर्मचारी'
        ]
      },
      {
        id: 'words-expert-long',
        name: 'Difficult / Long Compound Words (दक्ष स्तरका लामा तथा संयुक्त शब्दहरू)',
        nepaliName: 'दक्ष स्तरका लामा तथा संयुक्त शब्दहरू',
        description: 'Complex multi-stem Devanagari legal, constitutional, and governance compounds.',
        items: [
          'अन्तर्राष्ट्रिय', 'प्रतिनिधिसभा', 'राष्ट्रियसभा', 'संविधानसभा', 'महान्यायाधिवक्ता',
          'अन्तरिमसंसद', 'अधिकारसम्पन्न', 'पुनरावेदनअदालत', 'संवैधानिकइजलास', 'सुशासनप्रवर्द्धन',
          'न्यायिकपुनरावलोकन', 'सार्वजनिकसरोकार', 'जवाफदेहिता', 'पारदर्शिता', 'बन्दीप्रत्यक्षीकरण',
          'सार्वभौमसत्तासम्पन्न', 'विकेन्द्रीकरणप्रणाली', 'संस्थागतसुशासन', 'प्रशासकीयअदालत', 'सम्पत्तिविवरण'
        ]
      },
      {
        id: 'words-commonly-used',
        name: 'Commonly Used Words (दैनिक प्रयोगका शब्दहरू)',
        nepaliName: 'दैनिक बोलीचाली तथा कार्यालयका सामान्य शब्दहरू',
        description: 'Standard Nepali vocabulary frequently encountered in formal writing.',
        items: [
          'नमस्ते', 'धन्यवाद', 'स्वागत', 'कृपया', 'सम्बन्धित', 'उपस्थित', 'निवेदन', 'प्रार्थना',
          'सूचना', 'जानकारी', 'आदेश', 'निर्णय', 'मिति', 'स्थान', 'विषय', 'महोदय',
          'हस्ताक्षर', 'प्रमाणित', 'संख्या', 'विवरण', 'नियम', 'सर्त', 'शुल्क', 'मिति'
        ]
      }
    ]
  },

  // 5. SENTENCE PRACTICE (वाक्य अभ्यास)
  {
    id: 'sentence-practice',
    name: 'Sentence Practice',
    nepaliName: 'वाक्य अभ्यास',
    description: 'Type full sentences with punctuation (।), commas, quotes, and conjunctions.',
    difficulty: 'Advanced',
    subCategories: [
      {
        id: 'sentences-short',
        name: 'Short Sentences (छोटा सरल वाक्यहरू ४-६ शब्द)',
        nepaliName: 'छोटा सरल वाक्यहरू',
        description: 'Crisp 4-6 word sentences focusing on smooth typing flow.',
        items: [
          'नेपाल एक सुन्दर देश हो।',
          'हामी सबै नेपाली हौं।',
          'समयको उचित सदुपयोग गरौं।',
          'सत्यको सधैं विजय हुन्छ।',
          'निरन्तर अभ्यासले सफलता दिलाउँछ।',
          'शिक्षा नै उज्यालो भविष्यको आधार हो।',
          'प्रकृतिलाई स्वच्छ र सफा राखौं।',
          'आफ्नो कर्तव्य इमान्दारीपूर्वक पूरा गरौं।',
          'कम्प्युटर टाइपिंग एउटा महत्वपूर्ण सीप हो।',
          'परिश्रम नै सफलताको साँचो हो।',
          'स्वास्थ्य नै सबैभन्दा ठूलो धन हो।',
          'सकारात्मक सोचले जीवन बदल्छ।'
        ]
      },
      {
        id: 'sentences-medium',
        name: 'Medium Sentences (मध्यम प्रशासनिक वाक्यहरू ८-१२ शब्द)',
        nepaliName: 'मध्यम प्रशासनिक वाक्यहरू',
        description: '8-12 word sentences reflecting official communications and public interest.',
        items: [
          'नेपालको संविधानले सबै नागरिकलाई समान हक र अधिकारको प्रत्याभूति गरेको छ।',
          'सार्वजनिक सेवा प्रवाहलाई छिटो, छरितो र पारदर्शी बनाउन सूचना प्रविधिको प्रयोग आवश्यक छ।',
          'लोकतन्त्रको सुदृढीकरणका लागि विधिको शासन र नागरिक सचेतना अपरिहार्य तत्व हुन्।',
          'पारदर्शिता, जवाफदेहिता र निष्पक्षता नै सुशासनका प्रमुख आधारस्तम्भ हुन्।',
          'युवा जनशक्तिलाई राष्ट्र निर्माणको मूल प्रवाहमा समाहित गर्न रोजगारीका अवसर सिर्जना गर्नुपर्छ।',
          'वातावरण संरक्षण र दिगो विकासका लक्ष्य हासिल गर्न सबै नागरिकको सहभागिता जरुरी छ।',
          'निजामती कर्मचारीले सेवाग्राहीप्रति मर्यादित, उत्तरदायी र सहयोगी व्यवहार प्रदर्शन गर्नुपर्छ।',
          'डिजिटल प्रविधिको विकासले सरकारी सेवालाई प्रभावकारी र पहुँचयोग्य बनाउन मद्दत गरेको छ।'
        ]
      },
      {
        id: 'sentences-long-legal',
        name: 'Long Sentences (संयुक्त तथा कानूनी लामा वाक्यहरू)',
        nepaliName: 'संयुक्त तथा कानूनी लामा वाक्यहरू',
        description: 'Complex sentences with compound clauses, legal provisions, and formal terminology.',
        items: [
          'सर्वोच्च अदालतले संविधानको व्याख्या गर्दै नागरिकको मौलिक हकको संरक्षणमा ऐतिहासिक आदेश जारी गरेको छ।',
          'व्यवस्थापिका संसदले नयाँ आर्थिक विधेयक पारित गरी कार्यान्वयनका लागि सम्बन्धित निकायमा पठाएको छ।',
          'कुनै पनि नागरिकलाई कानून बमोजिम बाहेक व्यक्तिगत स्वतन्त्रताबाट वञ्चित गरिने छैन भनी संविधानमा स्पष्ट उल्लेख छ।',
          'सार्वजनिक प्रशासनलाई जनउत्तरदायी, पारदर्शी, निष्पक्ष र प्रभावकारी बनाउन समयसापेक्ष प्रशासनिक सुधार आवश्यक छ।',
          'नेपालको सार्वभौमसत्ता, भौगोलिक अखण्डता र राष्ट्रिय एकताको रक्षा गर्नु प्रत्येक नागरिकको परम कर्तव्य हो।'
        ]
      }
    ]
  }
];

export const DIFFICULTY_LEVEL_TABS = ['All', 'Beginner', 'Basic', 'Intermediate', 'Advanced'] as const;

