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
  // 1. BASIC CHARACTERS (वर्ण अभ्यास)
  {
    id: 'basic-characters',
    name: 'Basic Characters',
    nepaliName: 'आधारभूत वर्ण अभ्यास',
    description: 'Master individual Devanagari vowels, consonants, and standard romanized mappings.',
    difficulty: 'Beginner',
    subCategories: [
      {
        id: 'vowels',
        name: 'Vowels (स्वर वर्ण)',
        nepaliName: 'स्वर वर्ण (१३ वटा)',
        description: 'Practice independent Devanagari vowels (अ देखि अः सम्म)',
        items: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'],
        romanHints: {
          'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee / I', 'उ': 'u', 'ऊ': 'oo / U',
          'ऋ': 'ri / R', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'am / an', 'अः': 'ah / H'
        }
      },
      {
        id: 'consonants-k-ch',
        name: 'Consonants: Ka & Cha Groups',
        nepaliName: 'क-वर्ग र च-वर्ग',
        description: 'First 10 consonants (क, ख, ग, घ, ङ, च, छ, ज, झ, ञ)',
        items: ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ'],
        romanHints: {
          'क': 'k', 'ख': 'kh / K', 'ग': 'g', 'घ': 'gh / G', 'ङ': 'ng',
          'च': 'ch / c', 'छ': 'chh / C', 'ज': 'j', 'झ': 'jh / J', 'ञ': 'yn / N'
        }
      },
      {
        id: 'consonants-t-t',
        name: 'Consonants: Retroflex Ta & Dental Ta Groups',
        nepaliName: 'ट-वर्ग र त-वर्ग',
        description: 'Next 10 consonants (ट, ठ, ड, ढ, ण, त, थ, द, ध, न)',
        items: ['ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न'],
        romanHints: {
          'ट': 'T', 'ठ': 'Th', 'ड': 'D', 'ढ': 'Dh', 'ण': 'N',
          'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n'
        }
      },
      {
        id: 'consonants-p-h',
        name: 'Consonants: Pa, Ya & Sa Groups',
        nepaliName: 'प-वर्ग, य-वर्ग र स-वर्ग',
        description: 'Remaining consonants (प देखि ह सम्म)',
        items: ['प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह'],
        romanHints: {
          'प': 'p', 'फ': 'ph / f / P', 'ब': 'b', 'भ': 'bh / B', 'म': 'm',
          'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'w / v', 'श': 'sh / S', 'ष': 'Sh', 'स': 's', 'ह': 'h'
        }
      }
    ]
  },

  // 2. MATRA PRACTICE (मात्रा अभ्यास)
  {
    id: 'matras-drill',
    name: 'Matra Practice',
    nepaliName: 'मात्रा अभ्यास',
    description: 'Learn vowel signs (ा, ि, ी, ु, ू, े, ै, ो, ौ, ृ, ं, ँ, ः) with different consonants.',
    difficulty: 'Basic',
    subCategories: [
      {
        id: 'matra-aakar-ikar',
        name: 'Aakar (ा) & Ikar (ि / ी)',
        nepaliName: 'आकार (ा) र इकार (ि/ी)',
        description: 'Practice attaching aakar and short/long ikar to consonants.',
        items: [
          'का', 'कि', 'की', 'खा', 'खि', 'खी', 'गा', 'गि', 'गी',
          'चा', 'चि', 'ची', 'जा', 'जि', 'जी', 'ता', 'ति', 'ती',
          'दा', 'दि', 'दी', 'पा', 'पि', 'पी', 'मा', 'मि', 'मी', 'सा', 'सि', 'सी'
        ]
      },
      {
        id: 'matra-ukar-ekar',
        name: 'Ukar (ु / ू) & Ekar (े / ै)',
        nepaliName: 'उकार (ु/ू) र एकार (े/ै)',
        description: 'Practice short/long ukar and single/double ekar with consonants.',
        items: [
          'कु', 'कू', 'के', 'कै', 'गु', 'गू', 'गे', 'गै',
          'तु', 'तू', 'ते', 'तै', 'दु', 'दू', 'दे', 'दै',
          'पु', 'पू', 'पे', 'पै', 'मु', 'मू', 'मे', 'मै', 'सु', 'सू', 'से', 'सै'
        ]
      },
      {
        id: 'matra-okar-rikar',
        name: 'Okar (ो / ौ) & Rikar (ृ)',
        nepaliName: 'ओकार (ो/ौ) र ऋकार (ृ)',
        description: 'Practice okar, aukar, and rikar combinations.',
        items: [
          'को', 'कौ', 'कृ', 'गो', 'गौ', 'गृ', 'तो', 'तौ', 'तृ',
          'दो', 'दौ', 'दृ', 'पो', 'पौ', 'पृ', 'भो', 'भौ', 'भृ',
          'मो', 'मौ', 'मृ', 'सो', 'सौ', 'सृ', 'हो', 'हौ', 'हृ'
        ]
      },
      {
        id: 'matra-nasal-halant',
        name: 'Bindu (ं), Chandrabindu (ँ) & Halant (्)',
        nepaliName: 'शिरविन्दु (ं), चन्द्रविन्दु (ँ) र हलन्त (्)',
        description: 'Practice nasal diacritics, anusvara, and half letter halants.',
        items: [
          'कं', 'गं', 'तं', 'पं', 'सं', 'काँ', 'साँ', 'पाँ', 'गाउँ', 'ठाउँ', 'आँखा', 'बाँस',
          'क्', 'ख्', 'ग्', 'घ्', 'च्', 'ज्', 'त्', 'द्', 'न्', 'प्', 'म्', 'स्', 'ल्'
        ]
      }
    ]
  },

  // 3. CONJUNCTS & SANYUKTA AKSHAR (संयुक्त अक्षर)
  {
    id: 'conjuncts-drill',
    name: 'Conjunct Letters',
    nepaliName: 'संयुक्त वर्ण (कठिन अक्षर)',
    description: 'Master complex multi-character conjunct clusters essential for accurate Nepali typing.',
    difficulty: 'Intermediate',
    subCategories: [
      {
        id: 'primary-conjuncts',
        name: 'Primary Conjuncts (क्ष, त्र, ज्ञ, श्र)',
        nepaliName: 'मुख्य संयुक्त वर्ण (क्ष, त्र, ज्ञ, श्र)',
        description: 'The four most common compound Devanagari consonants.',
        items: [
          'क्ष', 'त्र', 'ज्ञ', 'श्र', 'क्षेत्र', 'क्षमता', 'त्रिशूल', 'त्रिभुज',
          'ज्ञान', 'ज्ञानी', 'श्रम', 'श्रीमती', 'शिक्षा', 'पत्रिका', 'प्रतिज्ञा', 'आश्रम'
        ],
        romanHints: {
          'क्ष': 'ksha / kshya', 'त्र': 'tra', 'ज्ञ': 'gya / jna', 'श्र': 'shra'
        }
      },
      {
        id: 'da-conjuncts',
        name: 'Da-Series Conjuncts (द्ध, द्व, द्य, द्र)',
        nepaliName: 'द-वर्गका संयुक्त वर्ण (द्ध, द्व, द्य, द्र)',
        description: 'Da ligature conjuncts frequently used in administrative and legal vocabulary.',
        items: [
          'द्ध', 'द्व', 'द्य', 'द्र', 'युद्ध', 'प्रसिद्ध', 'वृद्धि', 'द्वन्द्व',
          'द्वितीय', 'द्वार', 'विद्या', 'विद्यार्थी', 'उद्यम', 'चन्द्र', 'समुद्र', 'रुद्राक्ष'
        ]
      },
      {
        id: 'shta-shtra-conjuncts',
        name: 'Sh-Series & Tra Clusters (ष्ट, ष्ठ, ष्ट्र, न्द्र)',
        nepaliName: 'ष्ट, ष्ठ, ष्ट्र, न्द्र वर्ण समूह',
        description: 'Retroflex cluster conjuncts common in official Nepali text.',
        items: [
          'ष्ट', 'ष्ठ', 'ष्ट्र', 'न्द्र', 'दृष्टि', 'कष्ट', 'वरिष्ठ', 'श्रेष्ठ',
          'राष्ट्र', 'राष्ट्रिय', 'महाराष्ट्र', 'केन्द्र', 'केन्द्रीय', 'इन्द्र', 'महेन्द्र', 'नरेन्द्र'
        ]
      },
      {
        id: 'ra-ref-prakar',
        name: 'Ra Variants: Reph (र्) & Rakar (्र)',
        nepaliName: 'रेफ (र्) र रकार (्र) अभ्यास',
        description: 'Upper reph curves and lower rakar slants.',
        items: [
          'कर्म', 'धर्म', 'पर्व', 'वर्ष', 'सूर्य', 'कार्य', 'मार्ग', 'निर्णय',
          'क्रम', 'प्रकार', 'प्रथम', 'भ्रमण', 'ग्राम', 'श्रोता', 'वज्र', 'नम्र'
        ]
      },
      {
        id: 'geminates-half-clusters',
        name: 'Geminate & Rare Clusters (त्त, क्त, ङ्ग, ङ्क, च्च, म्म, न्न)',
        nepaliName: 'द्वित्व तथा दुर्लभ वर्ण (त्त, क्त, ङ्ग, ङ्क, ॐ, ऋ)',
        description: 'Double consonants and specialized Sanskrit ligatures.',
        items: [
          'त्त', 'क्त', 'ङ्ग', 'ङ्क', 'च्च', 'म्म', 'न्न', 'ल्ल', 'उत्तर', 'सत्य',
          'भक्त', 'रक्त', 'गङ्गा', 'अङ्क', 'बच्चा', 'सम्मा', 'अन्न', 'सल्ला', 'ऋषि', 'ऋतु', 'ॐ'
        ]
      }
    ]
  },

  // 4. WORD PRACTICE BY DIFFICULTY (शब्द अभ्यास)
  {
    id: 'word-practice',
    name: 'Word Practice',
    nepaliName: 'शब्द अभ्यास',
    description: 'Progressive vocabulary practice from 2-letter words to complex administrative terminology.',
    difficulty: 'Intermediate',
    subCategories: [
      {
        id: 'words-easy-23',
        name: '2 to 3 Character Easy Words',
        nepaliName: '२-३ अक्षरका सरल शब्दहरू',
        description: 'Common everyday words without complex conjuncts.',
        items: [
          'नेपाल', 'घर', 'काम', 'दिन', 'समय', 'पानी', 'खाना', 'मानिस', 'देश', 'भाषा',
          'जीवन', 'मित्र', 'ज्ञान', 'नाम', 'गाउँ', 'शहर', 'आकाश', 'फूल', 'रूख', 'बाटो',
          'कलम', 'आमा', 'बुबा', 'दाजु', 'दिदी', 'भाइ', 'बहिनी', 'साथी', 'किताब', 'मन'
        ]
      },
      {
        id: 'words-medium-matra',
        name: 'Medium Words (Matras & Halants)',
        nepaliName: 'मध्यम शब्दहरू (मात्रा र आधा अक्षर)',
        description: 'Practical daily vocabulary with matras and half letters.',
        items: [
          'संविधान', 'अधिकार', 'कानून', 'नागरिक', 'सरकार', 'शिक्षा', 'विकास', 'संस्कृति',
          'भविष्य', 'प्रविधि', 'विद्यार्थी', 'कार्यालय', 'व्यवसाय', 'समुदाय', 'स्वास्थ', 'उद्योग',
          'कृषि', 'पर्यटन', 'रोजगार', 'सहयोग', 'सञ्चार', 'पर्यावरण', 'संसार', 'सन्तुलन'
        ]
      },
      {
        id: 'words-advanced-admin',
        name: 'Advanced Administrative Words',
        nepaliName: 'प्रशासनिक तथा लोक सेवा शब्दावली',
        description: 'High-frequency official vocabulary used in government and exams.',
        items: [
          'व्यवस्थापिका', 'कार्यपालिका', 'न्यायपालिका', 'प्रजातन्त्र', 'लोकतन्त्र', 'महान्यायाधिवक्ता',
          'महानिर्देशक', 'सम्झौता', 'पुनरावेदन', 'अधिकारक्षेत्र', 'संवैधानिक', 'उत्तरदायित्व',
          'सार्वभौमसत्ता', 'स्वायत्तता', 'विकेन्द्रीकरण', 'प्रतिनिधिसभा', 'राष्ट्रियसभा', 'प्रमाणपत्र'
        ]
      },
      {
        id: 'words-expert-long',
        name: 'Expert Level Long Compound Words',
        nepaliName: 'दक्ष स्तरका लामा तथा संयुक्त शब्दहरू',
        description: 'Complex legal and multi-word Devanagari compound terms.',
        items: [
          'अन्तर्राष्ट्रिय', 'प्रतिनिधिसभा', 'राष्ट्रियसभा', 'संविधानसभा', 'महान्यायाधिवक्ता',
          'अन्तरिमसंसद', 'अधिकारसम्पन्न', 'पुनरावेदनअदालत', 'संवैधानिकइजलास', 'सुशासनप्रवर्द्धन',
          'न्यायिकपुनरावलोकन', 'सार्वजनिकसरोकार', 'जवाफदेहिता', 'पारदर्शिता', 'बन्दीप्रत्यक्षीकरण'
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
        name: 'Short Sentences (४-६ शब्द)',
        nepaliName: 'छोटा सरल वाक्यहरू',
        description: 'Crisp 4-6 word sentences focusing on flow.',
        items: [
          'नेपाल एक सुन्दर देश हो।',
          'हामी सबै नेपाली हौं।',
          'समयको उचित सदुपयोग गरौं।',
          'सत्यको सधैं विजय हुन्छ।',
          'निरन्तर अभ्यासले सफलता दिलाउँछ।',
          'शिक्षा नै उज्यालो भविष्यको आधार हो।',
          'प्रकृतिलाई स्वच्छ र सफा राखौं।',
          'आफ्नो कर्तव्य इमान्दारीपूर्वक पूरा गरौं।'
        ]
      },
      {
        id: 'sentences-medium',
        name: 'Medium Administrative Sentences (८-१२ शब्द)',
        nepaliName: 'मध्यम प्रशासनिक वाक्यहरू',
        description: '8-12 word sentences reflecting official communications.',
        items: [
          'नेपालको संविधानले सबै नागरिकलाई समान हक र अधिकारको प्रत्याभूति गरेको छ।',
          'सार्वजनिक सेवा प्रवाहलाई छिटो, छरितो र पारदर्शी बनाउन सूचना प्रविधिको प्रयोग आवश्यक छ।',
          'लोकतन्त्रको सुदृढीकरणका लागि विधिको शासन र नागरिक सचेतना अपरिहार्य तत्व हुन्।',
          'पारदर्शिता, जवाफदेहिता र निष्पक्षता नै सुशासनका प्रमुख आधारस्तम्भ हुन्।',
          'युवा जनशक्तिलाई राष्ट्र निर्माणको मूल प्रवाहमा समाहित गर्न रोजगारीका अवसर सिर्जना गर्नुपर्छ।'
        ]
      },
      {
        id: 'sentences-long-legal',
        name: 'Complex Legal & Governance Sentences',
        nepaliName: 'संयुक्त तथा कानूनी वाक्यहरू',
        description: 'Complex sentences with compound clauses and formal terminology.',
        items: [
          'सर्वोच्च अदालतले संविधानको व्याख्या गर्दै नागरिकको मौलिक हकको संरक्षणमा ऐतिहासिक आदेश जारी गरेको छ।',
          'व्यवस्थापिका संसदले नयाँ आर्थिक विधेयक पारित गरी कार्यान्वयनका लागि सम्बन्धित निकायमा पठाएको छ।',
          'कुनै पनि नागरिकलाई कानून बमोजिम बाहेक व्यक्तिगत स्वतन्त्रताबाट वञ्चित गरिने छैन भनी संविधानमा स्पष्ट उल्लेख छ।'
        ]
      }
    ]
  },

  // 6. PARAGRAPH PRACTICE (अनुच्छेद अभ्यास)
  {
    id: 'paragraph-practice',
    name: 'Paragraph Practice',
    nepaliName: 'अनुच्छेद अभ्यास',
    description: 'Complete multi-sentence paragraphs for continuous speed building and stamina.',
    difficulty: 'Expert',
    subCategories: [
      {
        id: 'para-constitution',
        name: 'Nepal Constitution Preamble',
        nepaliName: 'नेपालको संविधानको प्रस्तावना',
        description: 'Standard preamble passage for civic and official examination practice.',
        items: [
          'हामी सार्वभौमसत्तासम्पन्न नेपाली जनता, नेपालको स्वतन्त्रता, सार्वभौमिकता, भौगोलिक अखण्डता, राष्ट्रिय एकता, स्वाधीनता र स्वाभिमानलाई अक्षुण्ण राखी जनताको प्रतिस्पर्धात्मक बहुदलीय लोकतान्त्रिक शासन प्रणाली, नागरिक स्वतन्त्रता, मौलिक अधिकार, मानव अधिकार, बालिग मताधिकार, आवधिक निर्वाचन, पूर्ण प्रेस स्वतन्त्रता तथा स्वतन्त्र, निष्पक्ष र सक्षम न्यायपालिका र कानूनी राज्यको अवधारणा लगायतका लोकतान्त्रिक मूल्य र मान्यतामा आधारित समाजवादप्रति प्रतिबद्ध रही समृद्ध राष्ट्र निर्माण गर्न यो संविधान जारी गर्दछौं।'
        ]
      },
      {
        id: 'para-good-governance',
        name: 'Good Governance & Administration',
        nepaliName: 'सुशासन तथा सेवा प्रवाह',
        description: 'Paragraph reflecting modern public administration and accountability.',
        items: [
          'सुशासन भनेको राज्यको स्रोत र साधनको प्रभावकारी, न्यायोचित, पारदर्शी तथा जनउत्तरदायी ढंगले परिचालन गरी नागरिकको जीवनस्तर उकास्नु हो। विधिको शासन, जवाफदेहिता, पारदर्शिता, सहभागितामूलकता, निष्पक्षता र प्रभावकारिता सुशासनका अनिवार्य पूर्वसर्त हुन्। जबसम्म राज्य संयन्त्रले नागरिकलाई केन्द्रविन्दुमा राखेर सेवा प्रवाह गर्दैन, तबसम्म लोकतन्त्रको वास्तविक लाभ तल्लो तहसम्म पुग्न सक्दैन।'
        ]
      },
      {
        id: 'para-technology-future',
        name: 'Technology & National Development',
        nepaliName: 'सूचना प्रविधि र राष्ट्रिय विकास',
        description: 'Contemporary passage regarding digital Nepal framework and AI.',
        items: [
          'एक्काइसौं शताब्दीमा सूचना तथा सञ्चार प्रविधिको विकासले विश्वलाई एउटा सानो गाउँमा परिणत गरिदिएको छ। डिजिटल नेपाल फ्रेमवर्क अन्तर्गत सरकारी कामकाज, शिक्षा, स्वास्थ्य, वित्तीय कारोबार र कृषि क्षेत्रलाई डिजिटलाइज गर्ने प्रयासहरू भइरहेका छन्। कम्प्युटर टाइपिंग दक्षता, सफ्टवेयर विकास र इन्टरनेटको सही प्रयोगले युवा पुस्तालाई विश्व बजारमा प्रतिस्पर्धी बनाउन मद्दत गर्दछ।'
        ]
      }
    ]
  }
];

export const DIFFICULTY_LEVEL_TABS = ['All', 'Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'] as const;
