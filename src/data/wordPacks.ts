import { LegalTerm, PracticeModule } from '../types';

export const NEPALI_WORDS_EASY = [
  'नेपाल', 'घर', 'काम', 'दिन', 'समय', 'पानी', 'खाना', 'मानिस', 'देश', 'भाषा',
  'जीवन', 'मित्र', 'ज्ञान', 'नाम', 'गाउँ', 'शहर', 'आकाश', 'फूल', 'रूख', 'बाटो',
  'पुस्तक', 'कलम', 'आमा', 'बुबा', 'दाजु', 'दिदी', 'भाइ', 'बहिनी', 'साथी', 'विद्यालय'
];

export const NEPALI_WORDS_MEDIUM = [
  'संविधान', 'अधिकार', 'कानून', 'नागरिक', 'सरकार', 'शिक्षा', 'विकास', 'संस्कृति',
  'भविष्य', 'प्रविधि', 'विद्यार्थी', 'कार्यालय', 'व्यवसाय', 'समुदाय', 'स्वास्थ', 'उद्योग',
  'कृषि', 'पर्यटन', 'रोजगार', 'सहयोग', 'सञ्चार', 'पर्यावरण', 'संसार', 'सन्तुलन'
];

export const NEPALI_WORDS_HARD = [
  'व्यवस्थापिका', 'कार्यपालिका', 'न्यायपालिका', 'प्रजातन्त्र', 'लोकतन्त्र', 'महान्यायाधिवक्ता',
  'महानिर्देशक', 'सम्झौता', 'पुनरावेदन', 'अधिकारक्षेत्र', 'संवैधानिक', 'उत्तरदायित्व',
  'सार्वभौमसत्ता', 'स्वायत्तता', 'विकेन्द्रीकरण', 'प्रतिनिधिसभा', 'राष्ट्रियसभा', 'प्रमाणपत्र'
];

export const NEPALI_WORDS_EXPERT = [
  'अन्तर्राष्ट्रिय', 'प्रतिनिधिसभा', 'राष्ट्रियसभा', 'संविधानसभा', 'महान्यायाधिवक्ता',
  'अन्तरिमसंसद', 'अधिकारसम्पन्न', 'पुनरावेदनअदालत', 'संवैधानिकइजलास', 'सुशासनप्रवर्द्धन',
  'न्यायिकपुनरावलोकन', 'सार्वजनिकसरोकार', 'जवाफदेहिता', 'पारदर्शिता'
];

export const ENGLISH_WORDS_EASY = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with',
  'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she'
];

export const ENGLISH_WORDS_MEDIUM = [
  'constitution', 'democracy', 'government', 'justice', 'citizenship', 'parliament', 'jurisdiction',
  'legislation', 'fundamental', 'sovereignty', 'executive', 'judiciary', 'statute', 'amendment', 'verdict'
];

export const LEGAL_TERMS_PACK: LegalTerm[] = [
  { devanagari: 'संविधान', romanized: 'samvidhan', englishMeaning: 'Constitution (Supreme Law of the Nation)', category: 'Constitution' },
  { devanagari: 'अदालत', romanized: 'adalat', englishMeaning: 'Court of Law', category: 'Court & Judiciary' },
  { devanagari: 'न्यायाधीश', romanized: 'nyayadhish', englishMeaning: 'Judge / Magistrate', category: 'Court & Judiciary' },
  { devanagari: 'कानून', romanized: 'kanoon', englishMeaning: 'Law / Statute', category: 'Civil & Criminal' },
  { devanagari: 'अधिकार', romanized: 'adhikar', englishMeaning: 'Right / Entitlement', category: 'Constitution' },
  { devanagari: 'सरकार', romanized: 'sarkar', englishMeaning: 'Government', category: 'Government & Admin' },
  { devanagari: 'निवेदन', romanized: 'nivedan', englishMeaning: 'Petition / Application', category: 'Court & Judiciary' },
  { devanagari: 'फैसला', romanized: 'faisala', englishMeaning: 'Verdict / Judgment / Decree', category: 'Court & Judiciary' },
  { devanagari: 'पुनरावेदन', romanized: 'punaravedan', englishMeaning: 'Appeal', category: 'Court & Judiciary' },
  { devanagari: 'आदेश', romanized: 'aadesh', englishMeaning: 'Writ / Judicial Order', category: 'Court & Judiciary' },
  { devanagari: 'न्यायिक', romanized: 'nyayik', englishMeaning: 'Judicial / Legal', category: 'Court & Judiciary' },
  { devanagari: 'संघीय', romanized: 'sanghiya', englishMeaning: 'Federal', category: 'Government & Admin' },
  { devanagari: 'स्थानीय', romanized: 'sthaniya', englishMeaning: 'Local Level', category: 'Government & Admin' },
  { devanagari: 'प्रदेश', romanized: 'pradesh', englishMeaning: 'Province / State', category: 'Government & Admin' },
  { devanagari: 'महान्यायाधिवक्ता', romanized: 'mahanyayadhivakta', englishMeaning: 'Attorney General', category: 'Government & Admin' },
  { devanagari: 'विधेयक', romanized: 'vidheyak', englishMeaning: 'Legislative Bill', category: 'Government & Admin' },
  { devanagari: 'नियमावली', romanized: 'niyamavali', englishMeaning: 'Regulations / Rules', category: 'Civil & Criminal' },
  { devanagari: 'ऐन', romanized: 'ain', englishMeaning: 'Act of Parliament', category: 'Civil & Criminal' },
  { devanagari: 'दफा', romanized: 'dafa', englishMeaning: 'Section / Article Clause', category: 'Civil & Criminal' },
  { devanagari: 'उपदफा', romanized: 'upadafa', englishMeaning: 'Sub-section', category: 'Civil & Criminal' },
  { devanagari: 'सम्झौता', romanized: 'samjhauta', englishMeaning: 'Treaty / Agreement / Contract', category: 'Civil & Criminal' },
  { devanagari: 'अधिकारक्षेत्र', romanized: 'adhikarkshetra', englishMeaning: 'Jurisdiction', category: 'Court & Judiciary' },
  { devanagari: 'रिट', romanized: 'rit', englishMeaning: 'Writ Petition', category: 'Court & Judiciary' },
  { devanagari: 'अन्तरिम', romanized: 'antarim', englishMeaning: 'Interim / Provisional', category: 'Court & Judiciary' },
  { devanagari: 'प्रमाण', romanized: 'praman', englishMeaning: 'Evidence / Proof', category: 'Civil & Criminal' },
  { devanagari: 'बहस', romanized: 'bahas', englishMeaning: 'Legal Hearing / Argument', category: 'Court & Judiciary' },
  { devanagari: 'मिसिल', romanized: 'misil', englishMeaning: 'Case File / Docket', category: 'Court & Judiciary' },
  { devanagari: 'तारिख', romanized: 'tarikh', englishMeaning: 'Hearing Date', category: 'Court & Judiciary' },
  { devanagari: 'प्रतिवादी', romanized: 'prativadi', englishMeaning: 'Defendant / Respondent', category: 'Court & Judiciary' },
  { devanagari: 'वादी', romanized: 'badi', englishMeaning: 'Plaintiff / Petitioner', category: 'Court & Judiciary' }
];

export const PRACTICE_MODULES: PracticeModule[] = [
  {
    id: 'vowels',
    title: 'Only Vowels (स्वर वर्ण)',
    nepaliTitle: 'स्वर वर्ण अभ्यास',
    category: 'vowels',
    items: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'],
    description: 'Master independent Devanagari vowels from अ to अः.'
  },
  {
    id: 'consonants',
    title: 'Only Consonants (व्यञ्जन वर्ण)',
    nepaliTitle: 'व्यञ्जन वर्ण अभ्यास',
    category: 'consonants',
    items: [
      'क', 'ख', 'ग', 'घ', 'ङ',
      'च', 'छ', 'ज', 'झ', 'ञ',
      'ट', 'ठ', 'ड', 'ढ', 'ण',
      'त', 'थ', 'द', 'ध', 'न',
      'प', 'फ', 'ब', 'भ', 'म',
      'य', 'र', 'ल', 'व',
      'श', 'ष', 'स', 'ह'
    ],
    description: 'Master the 33 basic Devanagari consonants (क - ह).'
  },
  {
    id: 'matras',
    title: 'Matras (मात्रा अभ्यास)',
    nepaliTitle: 'मात्रा अभ्यास',
    category: 'matras',
    items: ['का', 'कि', 'की', 'कु', 'कू', 'के', 'कै', 'को', 'कौ', 'कं', 'कः', 'मा', 'मि', 'मी', 'मु', 'मू', 'मे', 'मै', 'मो', 'मौ'],
    description: 'Practice attaching vowel signs (मात्रा) to consonants.'
  },
  {
    id: 'half_letters',
    title: 'Half Letters (आधा अक्षर)',
    nepaliTitle: 'आधा अक्षर अभ्यास',
    category: 'half-letters',
    items: ['क्', 'ख्', 'ग्', 'घ्', 'च्', 'छ्', 'ज्', 'झ्', 'त्', 'थ्', 'द्', 'ध्', 'न्', 'प्', 'फ्', 'ब्', 'भ्', 'म्', 'स्'],
    description: 'Practice half letters used for conjuncts and halants.'
  },
  {
    id: 'conjuncts',
    title: 'Conjunct Letters (संयुक्त वर्ण)',
    nepaliTitle: 'संयुक्त वर्ण अभ्यास',
    category: 'conjuncts',
    items: ['क्ष', 'त्र', 'ज्ञ', 'श्र', 'द्व', 'द्ध', 'क्ष्म', 'न्द्य', 'न्त्य', 'प्र', 'द्र', 'क्र', 'स्र', 'ष्ट', 'ष्ठ'],
    description: 'Practice complex conjunct consonants (क्ष, त्र, ज्ञ, श्र).'
  },
  {
    id: 'legal_terms',
    title: 'Legal Vocabulary Pack (Lok Sewa)',
    nepaliTitle: 'कानूनी शब्दावली (लोक सेवा)',
    category: 'legal',
    items: LEGAL_TERMS_PACK.map(t => t.devanagari),
    description: 'Essential terminology for Judiciary & Lok Sewa examinations.'
  }
];

export const SAMPLE_PARAGRAPHS = {
  constitution: `नेपालको संविधान (२०७२):
भाग ३ - मौलिक हक र कर्तव्य
धारा १६. सम्मानपूर्वक बाँच्न पाउने हक: (१) प्रत्येक व्यक्तिलाई सम्मानपूर्वक बाँच्न पाउने हक हुनेछ। (२) कसैलाई पनि मृत्युदण्डको सजाय दिने गरी कानून बनाइने छैन।
धारा १७. स्वतन्त्रताको हक: (१) कानून बमोजिम बाहेक कुनै पनि व्यक्तिलाई वैयक्तिक स्वतन्त्रताबाट वञ्चित गरिने छैन। (२) प्रत्येक नागरिकलाई विचार र अभिव्यक्तिको स्वतन्त्रता, बिना हातहतियार शान्तिपूर्वक भेला हुने स्वतन्त्रता, र संघ संस्था खोल्ने स्वतन्त्रता हुनेछ।`,

  supreme_court_judgment: `सम्माननीय सर्वोच्च अदालतको आदेश:
पुनरावेदन दर्ता नं. ०७८-WO-१२३४
निवेदक: नागरिक अधिकार संरक्षण मञ्च
विरुद्ध: प्रत्यर्थी प्रधानमन्त्री तथा मन्त्रिपरिषद्को कार्यालय
फैसलाको व्यहोरा:
नेपालको संविधानको धारा १३३ को उपधारा (२) बमोजिम उत्प्रेषण तथा परमादेशको आदेश जारी गरिपाऊँ भन्ने निवेदनमा सुनुवाइ हुँदा, मौलिक हकको प्रचलनमा कुनै किसिमको अनुचित बन्देज लगाउन नमिल्ने र सार्वभौमसत्तासम्पन्न नेपाली जनताको संवैधानिक अधिकार सुरक्षित राख्नु राज्यको अनिवार्य कर्तव्य हुने ठहर्छ।`,

  legal_newspaper: `कानूनी सचेतना तथा न्यायमा पहुँच:
न्यायपालिकाको स्वतन्त्रता र निष्पक्षता नै लोकतन्त्रको मूल आधार हो। अदालतबाट हुने फैसला र आदेशको प्रभावकारी कार्यान्वयनले मात्र कानूनको शासनको अनुभूति गराउँछ। लोक सेवा आयोग र न्याय सेवाको परीक्षा तयारी गर्ने परीक्षार्थीका लागि संवैधानिक व्यवस्था र अदालतका नजिरहरूको अध्ययन अपरिहार्य मानिन्छ।`,

  general_quote: `संसारमा सबैभन्दा ठूलो शक्ति सत्य र अहिंसा हो। ज्ञान नै सबैभन्दा ठूलो धन हो, र न्याय नै समाजको वास्तविक आधार हो। निरन्तर अभ्यासले मात्र मानिसलाई दक्षता र सफलताको शिखरमा पुर्याउँछ।`
};
