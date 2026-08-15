import { UserStats, KeyStats, TestResult, WeakKeyAnalysis, WeakWordRecord, PracticeLevel, GeneratedExercise, DailyImprovementChallenge } from '../types';
import { LEGAL_TERMS_PACK, LEGAL_PASSAGES } from '../data/wordPacks';
import { getRomanizedHintForWord } from './nepaliTransliteration';

// =========================================================================
// COMPREHENSIVE ROMANIZED DEVANAGARI PATTERN KNOWLEDGE BASE
// =========================================================================

export interface DevanagariPatternInfo {
  key: string;
  devanagari: string;
  romanizedSequence: string;
  category: 'conjunct' | 'half-letter' | 'consonant' | 'vowel' | 'matra' | 'legal-specific' | 'general';
  level1Drills: string[];
  level2Combinations: string[];
  level3Words: string[];
  level4DifficultWords: string[];
  level5Sentences: string[];
  level6Paragraph: string;
  legalWords: string[];
}

export const DEVANAGARI_PATTERNS: DevanagariPatternInfo[] = [
  {
    key: 'ny',
    devanagari: 'न्य',
    romanizedSequence: 'ny',
    category: 'conjunct',
    level1Drills: ['ny', 'ny', 'ny', 'ny', 'nya', 'nya', 'ny', 'nyay', 'ny', 'ny'],
    level2Combinations: ['nya', 'nyu', 'nyai', 'nyay', 'nye', 'nyo', 'nyau', 'nyan'],
    level3Words: ['न्याय', 'न्यायिक', 'न्यायाधीश', 'न्यायालय', 'न्यायपालिका', 'न्यून', 'न्यूनतम', 'धन्य'],
    level4DifficultWords: ['न्यायिकपुनरावलोकन', 'न्यायसम्पादन', 'न्यायपालिकाको', 'न्यायाधीशहरु', 'महान्यायाधिवक्ता', 'न्यायोचित', 'न्यायप्रणाली'],
    level5Sentences: [
      'नेपालको संविधानले स्वतन्त्र, निष्पक्ष र सक्षम न्यायपालिकाको प्रत्याभूति गरेको छ।',
      'सर्वोच्च अदालतका सम्माननीय प्रधान न्यायाधीशले न्यायिक फैसला सुनाउनु भयो।',
      'न्यायमा सबै नागरिकको समान पहुँच हुनु लोकतान्त्रिक शासन प्रणालीको आधारभूत मान्यता हो।'
    ],
    level6Paragraph: 'स्वतन्त्र र सक्षम न्यायपालिका लोकतन्त्रको मुटु हो। न्यायालयले प्रदान गर्ने निष्पक्ष न्यायले नागरिकका मौलिक हक तथा अधिकारको संरक्षण गर्दछ। सर्वोच्च अदालतका प्रधान न्यायाधीश तथा अन्य न्यायाधीशहरुले संविधानको व्याख्या गर्दै न्यायिक पुनरावलोकनको अधिकार प्रयोग गर्दछन्। न्याय सम्पादनमा ढिलाइ हुनु न्याय नपाउनु सरह मानिन्छ, तसर्थ न्यायपालिकाको आधुनिक सुदृढीकरण अपरिहार्य छ।',
    legalWords: ['न्याय', 'न्यायिक', 'न्यायाधीश', 'न्यायालय', 'न्यायपालिका', 'महान्यायाधिवक्ता', 'न्यायिकपुनरावलोकन', 'न्यायसम्पादन']
  },
  {
    key: 'tr',
    devanagari: 'त्र',
    romanizedSequence: 'tr',
    category: 'conjunct',
    level1Drills: ['tr', 'tr', 'tr', 'tra', 'tri', 'tru', 'tr', 'tra', 'tri', 'tr'],
    level2Combinations: ['tra', 'tri', 'tree', 'tru', 'tre', 'trai', 'tro', 'trau'],
    level3Words: ['तन्त्र', 'प्रजातन्त्र', 'लोकतन्त्र', 'चरित्र', 'छात्र', 'पत्रिका', 'मित्र', 'शत्रु', 'क्षेत्र'],
    level4DifficultWords: ['गणतन्त्रात्मक', 'लोकतन्त्रात्मक', 'सर्वसत्तावादी', 'अन्तर्राष्ट्रिय', 'प्रजातान्त्रिक', 'चारित्रिक', 'पत्रकारिता'],
    level5Sentences: [
      'नेपाल एक स्वतन्त्र, अविभाज्य, सार्वभौमसत्तासम्पन्न, समावेशी लोकतान्त्रिक गणतन्त्रात्मक राज्य हो।',
      'लोकतन्त्रको मुख्य सुन्दरता भनेको विधिको शासन र मानव अधिकारको पूर्ण प्रत्याभूति हो।',
      'सत्य र निष्पक्ष पत्रकारिताले देशको लोकतान्त्रिक संरचनालाई बलियो बनाउँछ।'
    ],
    level6Paragraph: 'नेपालको वर्तमान संविधानले संघीय लोकतान्त्रिक गणतन्त्रलाई संस्थागत गरेको छ। लोकतन्त्रमा सार्वभौमसत्ता जनतामा निहित हुन्छ। जनताले निर्वाचित गरेका प्रतिनिधिहरुद्वारा शासन सञ्चालन हुने व्यवस्था नै प्रजातान्त्रिक पद्धति हो। यस पद्धतिमा मानव अधिकार, मौलिक स्वतन्त्रता, आवधिक निर्वाचन तथा विधिको शासन अक्षुण्ण रहन्छन्।',
    legalWords: ['लोकतन्त्र', 'प्रजातन्त्र', 'गणतन्त्र', 'अन्तर्राष्ट्रिय', 'क्षेत्र', 'अधिकारक्षेत्र', 'चरित्र']
  },
  {
    key: 'n_murdhanya',
    devanagari: 'ण',
    romanizedSequence: 'N',
    category: 'consonant',
    level1Drills: ['N', 'N', 'Na', 'Ni', 'N', 'N', 'Na', 'Nee', 'N', 'N'],
    level2Combinations: ['Na', 'Ni', 'Nee', 'Nu', 'Noo', 'Ne', 'Nai', 'No'],
    level3Words: ['गणना', 'प्रशासन', 'निर्णय', 'प्रमाण', 'कारण', 'निर्माण', 'परिणाम', 'गुण', 'किरण', 'घोषणा'],
    level4DifficultWords: ['सार्वजनिकप्रशासन', 'प्रशासकीयअदालत', 'प्रमाणीकरण', 'निर्णयार्थ', 'पूर्वाधारनिर्माण', 'अन्तरिमनिर्णय'],
    level5Sentences: [
      'सार्वजनिक प्रशासनले जनतालाई चुस्त, दुरुस्त र प्रभावकारी सेवा प्रवाह गर्नुपर्दछ।',
      'अदालतले मिसिलमा संलग्न ठोस प्रमाण र कानुनका आधारमा अन्तिम निर्णय गर्दछ।',
      'मुलुकको पूर्वाधार निर्माण र आर्थिक गणनाले विकासको सही खाका तयार पार्छ।'
    ],
    level6Paragraph: 'सुशासन कायम गर्न सक्षम र पारदर्शी सार्वजनिक प्रशासनको ठूलो भूमिका रहन्छ। निजामती प्रशासनले राज्यका नीति तथा कानुनहरुको प्रभावकारी कार्यान्वयन गर्दछ। कुनैपनि विवादको न्यायिक निरुपण गर्दा मिसिल प्रमाणको यथोचित परीक्षण पश्चात मात्र तथ्यपरक निर्णय गरिन्छ। समयमै सही निर्णय लिनु नै असल व्यवस्थापकीय गुण हो।',
    legalWords: ['प्रशासन', 'निर्णय', 'प्रमाण', 'कारण', 'घोषणा', 'प्रशासकीय', 'प्रमाणीकरण']
  },
  {
    key: 'gy',
    devanagari: 'ज्ञ',
    romanizedSequence: 'gy',
    category: 'conjunct',
    level1Drills: ['gy', 'gy', 'gya', 'gyi', 'gy', 'gya', 'gyan', 'gy', 'gy', 'gya'],
    level2Combinations: ['gya', 'gyi', 'gyu', 'gye', 'gyai', 'gyo', 'gyan', 'gyat'],
    level3Words: ['ज्ञान', 'विज्ञ', 'अज्ञान', 'सर्वज्ञ', 'प्रतिज्ञा', 'संज्ञा', 'विज्ञप्ति', 'ज्ञानेन्द्रिय', 'जिज्ञासा'],
    level4DifficultWords: ['प्रतिज्ञापत्र', 'विज्ञसमूह', 'ज्ञानविज्ञान', 'जिज्ञासु', 'प्रेसविज्ञप्ति', 'विशेषज्ञता'],
    level5Sentences: [
      'ज्ञान र निरन्तर अभ्यासले मात्र दक्षता र आत्मविश्वास अभिवृद्धि गर्दछ।',
      'संवैधानिक कानुनका विज्ञहरुको राय लिएर नयाँ विधेयक तर्जुमा गरियो।',
      'अदालतमा उपस्थित साक्षीले सत्य बोल्ने प्रतिज्ञापत्रमा हस्ताक्षर गर्दछ।'
    ],
    level6Paragraph: 'ज्ञान नै मानव सभ्यताको सर्वोच्च मार्गदर्शक शक्ति हो। कानुनी र प्राविधिक क्षेत्रमा उच्च विशेषज्ञता हासिल गर्न निरन्तर अध्ययन र जिज्ञासा आवश्यक हुन्छ। अदालतमा बयान दिँदा साक्षीले सत्य र निष्पक्ष रहने कानुनी प्रतिज्ञा गर्दछन्। सरकारले जारी गर्ने आधिकारिक प्रेस विज्ञप्तिमा सार्वजनिक महत्वका नीतिगत निर्णयहरु समावेश हुन्छन्।',
    legalWords: ['विज्ञ', 'प्रतिज्ञापत्र', 'संज्ञा', 'विज्ञप्ति', 'विशेषज्ञ', 'ज्ञान']
  },
  {
    key: 'ksh',
    devanagari: 'क्ष',
    romanizedSequence: 'ksh',
    category: 'conjunct',
    level1Drills: ['ksh', 'ksh', 'ksha', 'kshi', 'ksh', 'ksha', 'kshe', 'ksh', 'ksh', 'ksha'],
    level2Combinations: ['ksha', 'kshi', 'kshee', 'kshu', 'kshe', 'ksho', 'ksham', 'kshet'],
    level3Words: ['क्षेत्र', 'क्षमा', 'रक्षा', 'प्रत्यक्ष', 'संरक्षण', 'परीक्षा', 'सक्षम', 'लक्षण', 'दक्ष'],
    level4DifficultWords: ['अधिकारक्षेत्र', 'बालसंरक्षण', 'वातावरणसंरक्षण', 'प्रत्यक्षदर्शी', 'क्षमताअभिवृद्धि', 'सुरक्षाव्यवस्था'],
    level5Sentences: [
      'सर्वोच्च अदालतको असाधारण अधिकारक्षेत्र अन्तर्गत विभिन्न रिट जारी गरिन्छ।',
      'प्रत्येक नागरिकको जिउ, ज्यान, सम्पत्ति र मौलिक अधिकारको रक्षा गर्नु राज्यको दायित्व हो।',
      'बालबालिकाको उचित विकास र संरक्षणका लागि विशेष कानुनी व्यवस्था गरिएको छ।'
    ],
    level6Paragraph: 'संविधानले प्रत्येक अदालतको स्पष्ट क्षेत्राधिकार तोकेको छ। अदालतले आफ्नो अधिकारक्षेत्र भित्र रहेर मुद्दाको पुर्पक्ष र फैसला गर्दछ। वातावरणीय सन्तुलन र जैविक विविधताको संरक्षण गर्नु सबैको साझा कर्तव्य हो। प्रत्यक्षदर्शी साक्षीको बयान र दसी प्रमाणले न्यायिक परीक्षणलाई थप विश्वसनीय र सक्षम बनाउँछ।',
    legalWords: ['क्षेत्र', 'अधिकारक्षेत्र', 'संरक्षण', 'प्रत्यक्ष', 'सक्षम', 'रक्षा', 'क्षमा']
  },
  {
    key: 'shr',
    devanagari: 'श्र',
    romanizedSequence: 'shr',
    category: 'conjunct',
    level1Drills: ['shr', 'shr', 'shra', 'shri', 'shr', 'shra', 'shree', 'shr', 'shr', 'shra'],
    level2Combinations: ['shra', 'shri', 'shree', 'shru', 'shre', 'shrai', 'shram', 'shrav'],
    level3Words: ['श्रीमान्', 'श्रम', 'श्रमिक', 'विश्राम', 'श्रद्धा', 'श्री', 'श्रव्य', 'आश्रम', 'श्रेणी'],
    level4DifficultWords: ['श्रमअदालत', 'श्रमजीवी', 'श्रमिकअधिकार', 'श्रद्धान्जली', 'श्रव्यदृश्य', 'उच्चश्रेणी'],
    level5Sentences: [
      'इजलासमा उपस्थित वकिलले सम्माननीय श्रीमान् समक्ष आफ्नो कानुनी बहस प्रस्तुत गरे।',
      'श्रम ऐनले हरेक श्रमिकको उचित पारिश्रमिक र सामाजिक सुरक्षाको हक सुनिश्चित गरेको छ।',
      'डिजिटल अदालतमा श्रव्यदृश्य माध्यमबाट पनि प्रमाण बुझ्ने गरिन्छ।'
    ],
    level6Paragraph: 'श्रमको सम्मान नै समुन्नत समाज निर्माणको पहिलो खुड्किलो हो। श्रम अदालतले श्रमिक र रोजगारदाता बीचका विवादहरु कानुनी र व्यावहारिक रुपमा समाधान गर्दछ। इजलासमा बहसरत् कानुन व्यवसायीहरुले सम्मानित न्यायाधीश श्रीमान् सामु आफ्ना तथ्यपरक दलिलहरु पेश गर्दछन्। श्रमजीवी वर्गको हित संरक्षण गर्नु लोककल्याणकारी राज्यको दायित्व हो।',
    legalWords: ['श्रीमान्', 'श्रम', 'श्रमिक', 'श्रमअदालत', 'श्रमजीवी', 'श्रेणी']
  },
  {
    key: 'samv',
    devanagari: 'संव',
    romanizedSequence: 'samv',
    category: 'legal-specific',
    level1Drills: ['samv', 'samv', 'samvi', 'samva', 'samv', 'samv', 'samvidhan', 'samv', 'samv', 'samvi'],
    level2Combinations: ['samva', 'samvi', 'samvee', 'samve', 'samvat', 'samvad', 'samvahan'],
    level3Words: ['संविधान', 'संवैधानिक', 'संवत्', 'संवाद', 'संवाहक', 'संवर्धन', 'संवहन', 'संवित्ति'],
    level4DifficultWords: ['संवैधानिकइजलास', 'संवैधानिकपरिषद', 'संविधानसभा', 'संवैधानिकअंग', 'संवैधानिकउपचार', 'संवैधानिकसर्वाधिकार'],
    level5Sentences: [
      'संविधान देशको मूल कानुन हो र यससँग बाझिने कानुन बाझिएको हदसम्म अमान्य हुन्छ।',
      'संवैधानिक इजलासले गम्भीर संवैधानिक व्याख्या सम्बन्धी विवादहरुको निरुपण गर्दछ।',
      'संवैधानिक परिषदले विभिन्न संवैधानिक निकायका प्रमुख तथा पदाधिकारीहरुको सिफारिस गर्दछ।'
    ],
    level6Paragraph: 'संविधान देशको सर्वोच्च एवं मूल कानुन हो। संविधानले राज्यका तीन प्रमुख अंग कार्यपालिका, व्यवस्थापिका र न्यायपालिकाको शक्ति पृथकीकरण तथा सन्तुलन कायम गरेको छ। संवैधानिक इजलासले संविधानको व्याख्या सम्बन्धी गम्भीर प्रश्नहरुको अन्तिम टुङ्गो लगाउँछ। संवैधानिक निकायहरुले मुलुकमा सुशासन, जवाफदेहिता र विधिको शासन कायम राख्न महत्वपूर्ण भूमिका खेल्दछन्।',
    legalWords: ['संविधान', 'संवैधानिक', 'संवैधानिकइजलास', 'संवैधानिकपरिषद', 'संविधानसभा', 'संवैधानिकअंग']
  },
  {
    key: 'chch',
    devanagari: 'च्च',
    romanizedSequence: 'chch',
    category: 'conjunct',
    level1Drills: ['chch', 'chch', 'chcha', 'chcho', 'chch', 'chch', 'chcha', 'chch', 'chch', 'chcha'],
    level2Combinations: ['chcha', 'chchi', 'chchee', 'chchu', 'chche', 'chcho', 'chchai'],
    level3Words: ['सर्वोच्च', 'उच्च', 'कच्चा', 'बच्चा', 'सच्चा', 'गुच्चा', 'लुच्चा', 'उचाइ', 'उच्चारण'],
    level4DifficultWords: ['सर्वोच्चअदालत', 'उच्चअदालत', 'उच्चस्तरीय', 'उच्चायुक्त', 'उच्चपदस्थ', 'सर्वोच्चता'],
    level5Sentences: [
      'नेपालको न्यायिक संरचनामा सर्वोच्च अदालत, उच्च अदालत र जिल्ला अदालत गरी तीन तह रहेका छन्।',
      'सर्वोच्च अदालत अभिलेख अदालत हुनेछ र यसले गरेका फैसला नजिरका रुपमा सबैले मान्नुपर्दछ।',
      'उच्च अदालतले आफ्नो प्रादेशिक क्षेत्राधिकार भित्र न्यायिक सुपरिवेक्षण गर्दछ।'
    ],
    level6Paragraph: 'नेपालको संविधान अनुसार न्याय सम्बन्धी अधिकार अदालत तथा न्यायिक निकायहरुबाट प्रयोग हुन्छ। सर्वोच्च अदालत नेपालको न्याय प्रशासनको शीर्ष विन्दु हो जसले संविधान र कानुनको अन्तिम व्याख्या गर्दछ। प्रत्येक प्रदेशमा एक एक उच्च अदालत रहने व्यवस्था छ। सर्वोच्च अदालतले प्रतिपादन गरेका कानुनी सिद्धान्त र नजिरहरु सबै मातहतका अदालतहरुका लागि बाध्यात्मक हुन्छन्।',
    legalWords: ['सर्वोच्च', 'उच्च', 'सर्वोच्चअदालत', 'उच्चअदालत', 'उच्चस्तरीय', 'सर्वोच्चता']
  },
  {
    key: 'dh',
    devanagari: 'ध',
    romanizedSequence: 'dh',
    category: 'consonant',
    level1Drills: ['dh', 'dh', 'dha', 'dhi', 'dh', 'dha', 'dhee', 'dh', 'dhu', 'dh'],
    level2Combinations: ['dha', 'dhi', 'dhee', 'dhu', 'dhoo', 'dhe', 'dhai', 'dho', 'dhau'],
    level3Words: ['अधिकार', 'संविधान', 'न्यायाधीश', 'धारणा', 'धर्म', 'धन', 'धारा', 'बोध', 'साधन', 'सुविधा'],
    level4DifficultWords: ['मौलिकअधिकार', 'अधिकारसम्पन्न', 'मानवअधिकार', 'सूचनाकोहक', 'अधिवक्ता', 'दायित्वबोध', 'प्रधानन्यायाधीश'],
    level5Sentences: [
      'संविधानको भाग ३ मा नागरिकका मौलिक हक तथा स्वतन्त्रताहरुको व्यवस्था गरिएको छ।',
      'मौलिक अधिकार हनन भएमा नागरिकले संवैधानिक उपचारको हक प्रयोग गर्न पाउँछन्।',
      'राष्ट्रिय मानव अधिकार आयोगले मानव अधिकारको संरक्षण र प्रवर्द्धन गर्दछ।'
    ],
    level6Paragraph: 'मौलिक अधिकार नागरिकको स्वतन्त्र र मर्यादित जीवनयापनका लागि अनिवार्य आधार हुन्। नेपालको संविधानले समानता, स्वतन्त्रता, न्याय, सूचना र गोपनीयता सम्बन्धी अनेकौँ मौलिक हकहरु प्रत्याभूत गरेको छ। यी अधिकारहरुको उपभोगमा बाधा पुगेमा नागरिकले सर्वोच्च वा उच्च अदालतमा रिट निवेदन दिन सक्छन्। मानव अधिकारको रक्षा नै लोकतान्त्रिक शासनको मेरुदण्ड हो।',
    legalWords: ['अधिकार', 'मौलिकअधिकार', 'संविधान', 'न्यायाधीश', 'धारा', 'मानवअधिकार', 'प्रधानन्यायाधीश']
  },
  {
    key: 'r_reph',
    devanagari: 'र्',
    romanizedSequence: 'r',
    category: 'half-letter',
    level1Drills: ['r', 'r', 'ra', 'ri', 'r', 'r', 'ra', 're', 'r', 'r'],
    level2Combinations: ['ra', 'ri', 'ree', 'ru', 'roo', 're', 'rai', 'ro', 'rau'],
    level3Words: ['कार्य', 'धर्म', 'कर्म', 'वर्ग', 'मार्ग', 'सर्त', 'निर्णय', 'धैर्य', 'मूर्त', 'तर्क'],
    level4DifficultWords: ['कार्यपालिका', 'कार्यविधि', 'पुनर्विचार', 'सार्वजनिक', 'निर्णयात्मक', 'कार्यान्वयन', 'पुनर्स्थापना'],
    level5Sentences: [
      'कार्यपालिकाले मुलुकको शासन व्यवस्था र दैनिक प्रशासनिक कार्य सञ्चालन गर्दछ।',
      'अदालती कार्यविधि कानुन बमोजिम निष्पक्ष र छिटो छरितो हुनुपर्दछ।',
      'सार्वजनिक सरोकारको विवादमा जो सुकै नेपाली नागरिकले अदालतमा रिट दायर गर्न सक्दछ।'
    ],
    level6Paragraph: 'राज्य सञ्चालनमा कार्यपालिकाको भूमिका कार्यकारी प्रकृतिको हुन्छ। मन्त्रिपरिषद्ले संसद्ले बनाएका कानुनहरुको कार्यान्वयन र सार्वजनिक नीतिको व्यवस्थापन गर्दछ। प्रशासनिक कार्यसम्पादनमा पारदर्शिता र जवाफदेहिता अनिवार्य मानिन्छ। कुनैपनि सार्वजनिक निर्णय कानुनसम्मत र जनहितमा आधारित हुनुपर्दछ।',
    legalWords: ['कार्यपालिका', 'कार्यविधि', 'सार्वजनिक', 'निर्णय', 'सर्त', 'तर्क', 'कार्यान्वयन']
  }
];

// Fallback patterns for general keys
export const GENERAL_KEY_PATTERNS: Record<string, { devanagari: string; romanized: string; words: string[]; difficultWords: string[] }> = {
  'k': { devanagari: 'क', romanized: 'k', words: ['काम', 'कलम', 'कानून', 'किताब', 'कारण', 'कर्तव्य', 'कर'], difficultWords: ['कानूनव्यवसायी', 'कार्यान्वयन', 'कार्यपालिका', 'कार्यसम्पादन'] },
  'kh': { devanagari: 'ख', romanized: 'kh', words: ['खाता', 'खर्च', 'खुला', 'खोज', 'खेल', 'खतरा', 'खास'], difficultWords: ['खारेजी', 'खुलाअदालत', 'खरिदप्रक्रिया', 'खारेज'] },
  'g': { devanagari: 'ग', romanized: 'g', words: ['गाउँ', 'गति', 'गुण', 'गणना', 'गहन', 'गोपनीय', 'गठन'], difficultWords: ['गोपनीयताकोहक', 'गणतन्त्रात्मक', 'गैरसरकारी', 'गैरकानूनी'] },
  'gh': { devanagari: 'घ', romanized: 'gh', words: ['घर', 'घोषणा', 'घटना', 'घाटा', 'घन्टा', 'घरेलु'], difficultWords: ['घोषणापत्र', 'घटनाक्रम', 'घरेलुहिंसा', 'घरेलुउद्योग'] },
  'ch': { devanagari: 'च', romanized: 'ch', words: ['चार', 'चयन', 'चर्चा', 'चलन', 'चिट्ठा', 'चरण'], difficultWords: ['चरित्रप्रमाणपत्र', 'चुनौतीपूर्ण', 'चलनचल्ती'] },
  'j': { devanagari: 'ज', romanized: 'j', words: ['जल', 'जनता', 'जीवन', 'जिल्ला', 'जमानत', 'जारी'], difficultWords: ['जवाफदेहिता', 'जिल्लाअदालत', 'जनउत्तरदायी', 'जनसङ्ख्या'] },
  't': { devanagari: 'त', romanized: 't', words: ['तथ्य', 'तर्क', 'तस्बिर', 'तरिका', 'तलव', 'तुलना'], difficultWords: ['तथ्याङ्क', 'तत्काल', 'तजबिजी', 'तुलनात्मक'] },
  'd': { devanagari: 'द', romanized: 'd', words: ['दिन', 'देश', 'दफा', 'दण्ड', 'दर्ता', 'दावी'], difficultWords: ['दण्डहीनता', 'दाखिल', 'दस्तखत', 'दरपीठ'] },
  'p': { devanagari: 'प', romanized: 'p', words: ['पानी', 'पक्ष', 'पद', 'पुनरावेदन', 'प्रमाण', 'पत्र'], difficultWords: ['पुनरावलोकन', 'पारदर्शिता', 'पदाधिकारी', 'प्रतिवेदन'] },
  'ph': { devanagari: 'फ', romanized: 'ph', words: ['फूल', 'फैसला', 'फरक', 'फारम', 'फाँट', 'फौजदारी'], difficultWords: ['फौजदारीसंहिता', 'फर्छ्यौट', 'फैसलाकार्यान्वयन'] },
  'b': { devanagari: 'ब', romanized: 'b', words: ['बाटो', 'बयान', 'बहस', 'बन्दी', 'बैठक', 'बजेट'], difficultWords: ['बन्दीप्रत्यक्षीकरण', 'बहुदलीय', 'बहुमत', 'बालअधिकार'] },
  'bh': { devanagari: 'भ', romanized: 'bh', words: ['भाषा', 'भविष्य', 'भाग', 'भवन', 'भार', 'भूमिका'], difficultWords: ['भविष्यवाणी', 'भौतिकपूर्वाधार', 'भ्रष्टाचारनिवारण'] },
  'm': { devanagari: 'म', romanized: 'm', words: ['मानिस', 'मित्र', 'मुद्दा', 'मिसिल', 'मुख्य', 'माग'], difficultWords: ['महान्यायाधिवक्ता', 'महानिर्देशक', 'मन्त्रालय', 'मन्त्रिपरिषद्'] },
  'y': { devanagari: 'य', romanized: 'y', words: ['यन्त्र', 'योजना', 'योग्य', 'यथार्थ', 'युवा', 'यातायात'], difficultWords: ['यथार्थपरक', 'योग्यताप्रणाली', 'योजनाबद्ध'] },
  'l': { devanagari: 'ल', romanized: 'l', words: ['लाभांश', 'लिखित', 'लक्ष्य', 'लगत', 'लागु', 'लोक'], difficultWords: ['लोकतन्त्र', 'लोकसेवाआयोग', 'लोककल्याणकारी', 'लगतकट्टा'] },
  'v': { devanagari: 'व', romanized: 'v', words: ['विकास', 'विधि', 'वादी', 'विवाद', 'वकिल', 'विधेयक'], difficultWords: ['व्यवस्थापिका', 'विकेन्द्रीकरण', 'विधेयकपारित', 'विधिकोशासन'] },
  'w': { devanagari: 'व', romanized: 'w', words: ['विकास', 'विधि', 'वादी', 'विवाद', 'वकिल', 'विधेयक'], difficultWords: ['व्यवस्थापिका', 'विकेन्द्रीकरण', 'विधेयकपारित', 'विधिकोशासन'] },
  's': { devanagari: 'स', romanized: 's', words: ['समय', 'सरकार', 'संसद', 'सदन', 'सम्पत्ति', 'सार्वजनिक'], difficultWords: ['संवैधानिक', 'सार्वभौमसत्ता', 'सुशासन', 'समावेशी'] },
  'sh': { devanagari: 'श', romanized: 'sh', words: ['शहर', 'शिक्षा', 'शर्त', 'शासक', 'शाखा', 'श्रोत'], difficultWords: ['शाखाअधिकृत', 'शासकीयप्रणाली', 'शान्तिसुरक्षा'] },
  'h': { devanagari: 'ह', romanized: 'h', words: ['हात', 'हक', 'हद', 'हिसाब', 'हुलाक', 'हस्ताक्षर'], difficultWords: ['हस्तान्तरण', 'हदम्याद', 'हस्ताक्षरकर्ता'] }
};

// =========================================================================
// ANALYTICS INTELLIGENCE: DISTINGUISH FREQUENT VS MISTYPED
// =========================================================================

export function analyzeUserWeaknesses(
  userStats: UserStats,
  keyStatsMap: Record<string, KeyStats> = {},
  options: { forceLegal?: boolean } = {}
): {
  weakKeys: WeakKeyAnalysis[];
  weakWords: WeakWordRecord[];
  hasLegalHistory: boolean;
  totalErrorsAnalyzed: number;
  overallWeaknessScore: number;
} {
  const history = userStats.history || [];
  
  // Check if user has strong legal / lok sewa history
  const legalTestsCount = history.filter(h => 
    h.testType === 'legal' || 
    (h.categoryOrTitle && h.categoryOrTitle.toLowerCase().includes('legal')) ||
    (h.categoryOrTitle && h.categoryOrTitle.toLowerCase().includes('lok sewa')) ||
    (h.sampleText && (h.sampleText.includes('अदालत') || h.sampleText.includes('संविधान') || h.sampleText.includes('न्यायाधीश')))
  ).length;

  const hasLegalHistory = options.forceLegal || legalTestsCount >= 2 || (history.length > 0 && legalTestsCount / history.length >= 0.25);

  // 1. Merge Cumulative Key Stats
  const cumulativeKeys: Record<string, { totalHits: number; correctHits: number; mistakes: number; totalTimeMs: number }> = {};
  
  // Start with runtime map
  Object.entries(keyStatsMap).forEach(([k, stats]) => {
    const lower = k.toLowerCase();
    cumulativeKeys[lower] = {
      totalHits: stats.totalHits || 0,
      correctHits: stats.correctHits || 0,
      mistakes: stats.mistakes || 0,
      totalTimeMs: stats.totalTimeMs || 0
    };
  });

  // Aggregate across all historical sessions
  history.forEach(test => {
    Object.entries(test.keyStatsMap || {}).forEach(([k, stats]) => {
      const lower = k.toLowerCase();
      const st = stats as KeyStats;
      const prev = cumulativeKeys[lower] || { totalHits: 0, correctHits: 0, mistakes: 0, totalTimeMs: 0 };
      cumulativeKeys[lower] = {
        totalHits: prev.totalHits + (st.totalHits || 0),
        correctHits: prev.correctHits + (st.correctHits || 0),
        mistakes: prev.mistakes + (st.mistakes || 0),
        totalTimeMs: prev.totalTimeMs + (st.totalTimeMs || 0)
      };
    });
  });

  // 2. Aggregate Mistyped Characters Map
  const charMistakesMap: Record<string, number> = {};
  history.forEach(test => {
    Object.entries(test.mistypedCharsMap || {}).forEach(([char, count]) => {
      const cnt = Number(count) || 0;
      charMistakesMap[char] = (charMistakesMap[char] || 0) + cnt;
    });
    // Also include charErrors array
    (test.charErrors || []).forEach(err => {
      const target = err.targetChar;
      charMistakesMap[target] = (charMistakesMap[target] || 0) + (err.frequency || 1);
    });
  });

  // 3. Aggregate Mistyped Words Map & Track Evolution
  const wordStatsAgg: Record<string, {
    word: string;
    timesTyped: number;
    mistakes: number;
    totalLatencyMs: number;
    correctionsCount: number;
    lastMistakeDate: number;
    accuracies: number[];
  }> = {};

  history.forEach(test => {
    const timestamp = test.timestamp || Date.now();
    
    // Process word errors
    (test.wordErrors || []).forEach(wErr => {
      const w = wErr.targetWord;
      if (!wordStatsAgg[w]) {
        wordStatsAgg[w] = {
          word: w,
          timesTyped: 0,
          mistakes: 0,
          totalLatencyMs: 0,
          correctionsCount: 0,
          lastMistakeDate: timestamp,
          accuracies: []
        };
      }
      wordStatsAgg[w].timesTyped += 1;
      wordStatsAgg[w].mistakes += wErr.mistakes || 1;
      wordStatsAgg[w].totalLatencyMs += wErr.timeSpentMs || 1000;
      wordStatsAgg[w].correctionsCount += wErr.backspacesUsed || 0;
      wordStatsAgg[w].lastMistakeDate = Math.max(wordStatsAgg[w].lastMistakeDate, timestamp);
      const wordAcc = wErr.mistakes === 0 ? 100 : Math.max(0, 100 - (wErr.mistakes * 25));
      wordStatsAgg[w].accuracies.push(wordAcc);
    });

    // Also process mistypedWordsMap
    Object.entries(test.mistypedWordsMap || {}).forEach(([w, count]) => {
      const cnt = Number(count) || 0;
      if (!wordStatsAgg[w]) {
        wordStatsAgg[w] = {
          word: w,
          timesTyped: cnt + 1,
          mistakes: cnt,
          totalLatencyMs: cnt * 1200,
          correctionsCount: cnt,
          lastMistakeDate: timestamp,
          accuracies: [Math.max(30, 100 - cnt * 20)]
        };
      } else {
        wordStatsAgg[w].mistakes += cnt;
        wordStatsAgg[w].timesTyped += cnt;
        wordStatsAgg[w].lastMistakeDate = Math.max(wordStatsAgg[w].lastMistakeDate, timestamp);
      }
    });
  });

  // Calculate weak words records
  const weakWords: WeakWordRecord[] = Object.values(wordStatsAgg)
    .filter(w => w.word.length >= 2 && (w.mistakes > 0 || w.timesTyped >= 2))
    .map(w => {
      const acc = Math.round(Math.max(10, 100 - (w.mistakes / (w.timesTyped || 1)) * 100));
      const avgTime = Math.round(w.totalLatencyMs / (w.timesTyped || 1));
      
      // Calculate improvement %: compare first half of attempts with second half
      let imp = 0;
      if (w.accuracies.length >= 2) {
        const half = Math.floor(w.accuracies.length / 2);
        const firstHalf = w.accuracies.slice(0, half).reduce((a, b) => a + b, 0) / half;
        const secondHalf = w.accuracies.slice(half).reduce((a, b) => a + b, 0) / (w.accuracies.length - half);
        imp = Math.round(secondHalf - firstHalf);
      }

      // Check category in Legal Terms
      const legalMatch = LEGAL_TERMS_PACK.find(lt => lt.devanagari === w.word);

      return {
        word: w.word,
        romanized: legalMatch ? legalMatch.romanized : getRomanizedHintForWord(w.word),
        timesTyped: w.timesTyped,
        mistakesCount: w.mistakes,
        accuracy: Math.min(100, Math.max(0, acc)),
        avgTimeMs: avgTime || 1200,
        correctionsCount: w.correctionsCount,
        lastMistakeDate: w.lastMistakeDate,
        improvementPercent: imp,
        category: legalMatch ? legalMatch.category : undefined
      };
    })
    .sort((a, b) => {
      // Sort priority: High mistakes + low accuracy
      const scoreA = (a.mistakesCount * 3) + (100 - a.accuracy) * 1.5;
      const scoreB = (b.mistakesCount * 3) + (100 - b.accuracy) * 1.5;
      return scoreB - scoreA;
    });

  // 4. Map & Score Weak Keys and Romanized Sequences
  const scoredPatterns: WeakKeyAnalysis[] = [];

  DEVANAGARI_PATTERNS.forEach(pat => {
    // Determine mistakes related to this pattern from key stats, char errors, and words
    let mistakes = 0;
    let totalHits = 0;
    let totalLatency = 0;

    // Check individual letters in romanized sequence
    for (const char of pat.romanizedSequence) {
      const lower = char.toLowerCase();
      if (cumulativeKeys[lower]) {
        totalHits += cumulativeKeys[lower].totalHits;
        mistakes += cumulativeKeys[lower].mistakes;
        totalLatency += cumulativeKeys[lower].totalTimeMs;
      }
    }

    // Check devanagari char mistakes
    if (charMistakesMap[pat.devanagari]) {
      mistakes += charMistakesMap[pat.devanagari] * 2;
      totalHits += charMistakesMap[pat.devanagari] * 2;
    }

    // Check occurrences in mistyped words
    pat.level3Words.forEach(w => {
      if (wordStatsAgg[w]) {
        mistakes += wordStatsAgg[w].mistakes;
        totalHits += wordStatsAgg[w].timesTyped;
      }
    });

    const accuracy = totalHits > 0 
      ? Math.max(15, Math.min(100, Math.round(((totalHits - mistakes) / totalHits) * 100)))
      : (mistakes > 0 ? 65 : 88);

    const avgLatency = totalHits > 0 ? Math.round(totalLatency / totalHits) : 180;

    // Distinguish frequent vs mistyped:
    // Error Weight = (Mistakes * 4) + ((100 - Accuracy) * 2) + (Slow latency bonus)
    const errorWeight = (mistakes * 4) + ((100 - accuracy) * 2) + (avgLatency > 250 ? 15 : 0);

    const sampleWords = hasLegalHistory ? pat.legalWords : pat.level3Words;

    scoredPatterns.push({
      key: pat.key,
      devanagari: pat.devanagari,
      romanizedSequence: pat.romanizedSequence,
      mistakesCount: mistakes,
      totalHits,
      accuracy,
      avgLatencyMs: avgLatency,
      errorWeight,
      sampleWords,
      category: pat.category
    });
  });

  // Also include any standalone character from GENERAL_KEY_PATTERNS with high error count
  Object.entries(GENERAL_KEY_PATTERNS).forEach(([rawKey, genInfo]) => {
    const lower = rawKey.toLowerCase();
    const st = cumulativeKeys[lower];
    const devMistakes = charMistakesMap[genInfo.devanagari] || 0;
    const mistakes = (st?.mistakes || 0) + devMistakes;
    const totalHits = (st?.totalHits || 0) + devMistakes;

    if (mistakes >= 1 || (st && st.totalHits > 0 && st.mistakes / st.totalHits > 0.1)) {
      // Check if already covered in DEVANAGARI_PATTERNS
      const alreadyCovered = scoredPatterns.some(p => p.romanizedSequence === genInfo.romanized);
      if (!alreadyCovered) {
        const accuracy = totalHits > 0 ? Math.round(((totalHits - mistakes) / totalHits) * 100) : 70;
        const avgLatency = totalHits > 0 ? Math.round((st?.totalTimeMs || 0) / totalHits) : 200;
        const errorWeight = (mistakes * 3.5) + ((100 - accuracy) * 1.8);

        scoredPatterns.push({
          key: rawKey,
          devanagari: genInfo.devanagari,
          romanizedSequence: genInfo.romanized,
          mistakesCount: mistakes,
          totalHits,
          accuracy: Math.max(10, Math.min(100, accuracy)),
          avgLatencyMs: avgLatency,
          errorWeight,
          sampleWords: genInfo.words,
          category: 'consonant'
        });
      }
    }
  });

  // Sort by calculated Error Weight descending
  scoredPatterns.sort((a, b) => b.errorWeight - a.errorWeight);

  const totalErrorsAnalyzed = Object.values(cumulativeKeys).reduce((acc, k) => acc + k.mistakes, 0) +
    Object.values(charMistakesMap).reduce((acc, c) => acc + c, 0);

  const overallWeaknessScore = scoredPatterns.slice(0, 5).reduce((acc, p) => acc + p.errorWeight, 0);

  return {
    weakKeys: scoredPatterns,
    weakWords,
    hasLegalHistory,
    totalErrorsAnalyzed,
    overallWeaknessScore
  };
}

// =========================================================================
// PROGRESSIVE 6-LEVEL EXERCISE GENERATION
// =========================================================================

export function generateAdaptiveExercise(
  targetWeakPattern: WeakKeyAnalysis | null,
  level: PracticeLevel,
  isLegalPriority: boolean = false,
  allWeakKeys: WeakKeyAnalysis[] = []
): GeneratedExercise {
  // Fallback to 'ny' (न्य) if none provided
  const patternKey = targetWeakPattern?.key || 'ny';
  const pat = DEVANAGARI_PATTERNS.find(p => p.key === patternKey) || DEVANAGARI_PATTERNS[0];
  const generalPat = GENERAL_KEY_PATTERNS[patternKey];

  const targetDev = pat?.devanagari || generalPat?.devanagari || 'न्य';
  const targetRom = pat?.romanizedSequence || generalPat?.romanized || 'ny';

  switch (level) {
    case 1: {
      // Level 1: Character / Sequence Practice
      const drills = pat?.level1Drills || [targetRom, targetRom, targetRom, targetRom, `${targetRom}a`, `${targetRom}a`, targetRom, targetRom];
      // Repeat to form a good set of 20-25 items
      const items: string[] = [];
      while (items.length < 24) {
        items.push(...drills);
      }
      const trimmed = items.slice(0, 24);
      return {
        level: 1,
        levelTitle: 'Level 1: Character & Sequence Drills',
        levelDescription: `Drill the exact keystroke pattern for "${targetDev}" (${targetRom}) repeatedly to build finger muscle memory.`,
        targetKeys: [targetRom],
        targetSequences: [targetRom],
        targetDevanagari: [targetDev],
        items: trimmed,
        fullText: trimmed.join(' '),
        recommendedAccuracy: 95,
        isLegalFocus: false
      };
    }

    case 2: {
      // Level 2: Short Combinations
      const combos = pat?.level2Combinations || [`${targetRom}a`, `${targetRom}i`, `${targetRom}u`, `${targetRom}e`, `${targetRom}ai`, `${targetRom}o`];
      const items: string[] = [];
      while (items.length < 24) {
        items.push(...combos);
      }
      const trimmed = items.slice(0, 24);
      return {
        level: 2,
        levelTitle: 'Level 2: Short Syllable Combinations',
        levelDescription: `Practice vowel and matra transitions with "${targetDev}" (${targetRom}) across various sound combinations.`,
        targetKeys: [targetRom],
        targetSequences: [targetRom],
        targetDevanagari: [targetDev],
        items: trimmed,
        fullText: trimmed.join(' '),
        recommendedAccuracy: 92,
        isLegalFocus: false
      };
    }

    case 3: {
      // Level 3: Real Target Words
      const words = isLegalPriority && pat?.legalWords.length > 0 
        ? pat.legalWords 
        : (pat?.level3Words || generalPat?.words || ['न्याय', 'न्यायिक', 'न्यायाधीश', 'न्यायालय', 'न्यायपालिका']);
      
      const items: string[] = [];
      while (items.length < 20) {
        items.push(...words);
      }
      const trimmed = items.slice(0, 20);
      return {
        level: 3,
        levelTitle: 'Level 3: Core Target Words',
        levelDescription: `Type authentic Nepali words containing "${targetDev}" (${targetRom}) in meaningful contexts.`,
        targetKeys: [targetRom],
        targetSequences: [targetRom],
        targetDevanagari: [targetDev],
        items: trimmed,
        fullText: trimmed.join(' '),
        recommendedAccuracy: 90,
        isLegalFocus: isLegalPriority
      };
    }

    case 4: {
      // Level 4: Difficult & Complex Words
      const diffWords = isLegalPriority 
        ? (pat?.level4DifficultWords || ['न्यायिकपुनरावलोकन', 'न्यायसम्पादन', 'न्यायपालिकाको', 'महान्यायाधिवक्ता'])
        : (pat?.level4DifficultWords || generalPat?.difficultWords || ['न्यायिकपुनरावलोकन', 'न्यायसम्पादन', 'न्यायपालिकाको']);
      
      const items: string[] = [];
      while (items.length < 18) {
        items.push(...diffWords);
      }
      const trimmed = items.slice(0, 18);
      return {
        level: 4,
        levelTitle: 'Level 4: Advanced & Compound Words',
        levelDescription: `Master multi-syllable compound words and conjuncts centered around "${targetDev}" (${targetRom}).`,
        targetKeys: [targetRom],
        targetSequences: [targetRom],
        targetDevanagari: [targetDev],
        items: trimmed,
        fullText: trimmed.join(' '),
        recommendedAccuracy: 88,
        isLegalFocus: isLegalPriority
      };
    }

    case 5: {
      // Level 5: Contextual Sentences
      const sentences = pat?.level5Sentences || [
        'नेपालको संविधानले स्वतन्त्र, निष्पक्ष र सक्षम न्यायपालिकाको प्रत्याभूति गरेको छ।',
        'सर्वोच्च अदालतका सम्माननीय प्रधान न्यायाधीशले न्यायिक फैसला सुनाउनु भयो।',
        'न्यायमा सबै नागरिकको समान पहुँच हुनु लोकतान्त्रिक शासन प्रणालीको आधारभूत मान्यता हो।'
      ];
      return {
        level: 5,
        levelTitle: 'Level 5: Contextual Target Sentences',
        levelDescription: `Apply "${targetDev}" (${targetRom}) smoothly within complete sentences and natural flow.`,
        targetKeys: [targetRom],
        targetSequences: [targetRom],
        targetDevanagari: [targetDev],
        items: sentences,
        fullText: sentences.join(' '),
        recommendedAccuracy: 85,
        isLegalFocus: isLegalPriority
      };
    }

    case 6:
    default: {
      // Level 6: Complete Integrated Paragraph
      const paragraph = pat?.level6Paragraph || 'स्वतन्त्र र सक्षम न्यायपालिका लोकतन्त्रको मुटु हो। न्यायालयले प्रदान गर्ने निष्पक्ष न्यायले नागरिकका मौलिक हक तथा अधिकारको संरक्षण गर्दछ। सर्वोच्च अदालतका प्रधान न्यायाधीश तथा अन्य न्यायाधीशहरुले संविधानको व्याख्या गर्दै न्यायिक पुनरावलोकनको अधिकार प्रयोग गर्दछन्। न्याय सम्पादनमा ढिलाइ हुनु न्याय नपाउनु सरह मानिन्छ, तसर्थ न्यायपालिकाको आधुनिक सुदृढीकरण अपरिहार्य छ।';
      return {
        level: 6,
        levelTitle: 'Level 6: Full Integrated Master Paragraph',
        levelDescription: `Comprehensive passage integrating your weakest keys "${targetDev}" (${targetRom}) into complete text.`,
        targetKeys: [targetRom],
        targetSequences: [targetRom],
        targetDevanagari: [targetDev],
        items: paragraph.split(/\s+/).filter(Boolean),
        fullText: paragraph,
        recommendedAccuracy: 85,
        isLegalFocus: isLegalPriority
      };
    }
  }
}

// =========================================================================
// ADAPTIVE DIFFICULTY RECOMMENDATION LOGIC
// =========================================================================

export function getAdaptiveRecommendedLevel(
  currentAccuracy: number,
  consecutivePasses: number = 0
): {
  recommendedLevel: PracticeLevel;
  badgeText: string;
  reason: string;
} {
  if (currentAccuracy >= 95 || consecutivePasses >= 2) {
    return {
      recommendedLevel: 4,
      badgeText: 'Promoted to Advanced',
      reason: `Superb accuracy (${currentAccuracy}%)! Reduced repetition and advanced to Level 4/5 Difficult Words & Sentences.`
    };
  } else if (currentAccuracy >= 80) {
    return {
      recommendedLevel: 3,
      badgeText: 'Word Practice Recommended',
      reason: `Solid progress (${currentAccuracy}%). Continue Level 3 Word-level practice to lock in muscle memory.`
    };
  } else {
    return {
      recommendedLevel: 1,
      badgeText: 'Remediation Required',
      reason: `Accuracy below 80% (${currentAccuracy}%). Rebuilding foundational muscle memory with Level 1 Character Drills.`
    };
  }
}

// =========================================================================
// DAILY PERSONALIZED CHALLENGE GENERATOR
// =========================================================================

export function generateDailyChallenge(
  userStats: UserStats,
  weakKeys: WeakKeyAnalysis[]
): DailyImprovementChallenge {
  const today = new Date().toISOString().split('T')[0];
  
  // Stored daily challenge check in localStorage
  try {
    const saved = localStorage.getItem(`nepali_typing_daily_challenge_${today}`);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}

  // Pick top weakness or cycle through
  const topWeakness = weakKeys[0] || {
    key: 'ny',
    devanagari: 'न्य',
    romanizedSequence: 'ny',
    accuracy: 75
  };

  const pat = DEVANAGARI_PATTERNS.find(p => p.key === topWeakness.key) || DEVANAGARI_PATTERNS[0];

  const challenge: DailyImprovementChallenge = {
    date: today,
    focusKey: topWeakness.key,
    focusDevanagari: topWeakness.devanagari,
    focusRomanized: topWeakness.romanizedSequence,
    characterDrills: pat.level1Drills.slice(0, 10),
    wordDrills: pat.level3Words.slice(0, 8),
    difficultWords: pat.level4DifficultWords.slice(0, 5),
    paragraph: pat.level6Paragraph,
    isCompleted: false,
    initialAccuracy: topWeakness.accuracy,
    finalAccuracy: undefined,
    improvementScore: undefined
  };

  try {
    localStorage.setItem(`nepali_typing_daily_challenge_${today}`, JSON.stringify(challenge));
  } catch (e) {}

  return challenge;
}

export function saveDailyChallengeProgress(challenge: DailyImprovementChallenge): void {
  try {
    localStorage.setItem(`nepali_typing_daily_challenge_${challenge.date}`, JSON.stringify(challenge));
  } catch (e) {}
}
