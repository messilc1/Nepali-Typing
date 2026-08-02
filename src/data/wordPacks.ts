import { LegalTerm, PracticeModule, LegalPassage } from '../types';

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

// Single Legal Vocabulary Terms for Practice Mode Drills
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
  { devanagari: 'वादी', romanized: 'badi', englishMeaning: 'Plaintiff / Petitioner', category: 'Court & Judiciary' },
  { devanagari: 'अभियोजन', romanized: 'abhiyojan', englishMeaning: 'Prosecution', category: 'Civil & Criminal' },
  { devanagari: 'धरौटी', romanized: 'dharauti', englishMeaning: 'Bail / Security Deposit', category: 'Court & Judiciary' },
  { devanagari: 'पुनरावलोकन', romanized: 'punaravalokan', englishMeaning: 'Judicial Review', category: 'Court & Judiciary' },
  { devanagari: 'उत्प्रेषण', romanized: 'utpreshan', englishMeaning: 'Certiorari Writ', category: 'Court & Judiciary' },
  { devanagari: 'परमादेश', romanized: 'paramadesh', englishMeaning: 'Mandamus Writ', category: 'Court & Judiciary' },
  { devanagari: 'अधिकारपृच्छा', romanized: 'adhikarprichha', englishMeaning: 'Quo Warranto Writ', category: 'Court & Judiciary' },
  { devanagari: 'प्रतिषेध', romanized: 'pratishedh', englishMeaning: 'Prohibition Writ', category: 'Court & Judiciary' },
  { devanagari: 'बन्दीप्रत्यक्षीकरण', romanized: 'bandipratyakshikaran', englishMeaning: 'Habeas Corpus Writ', category: 'Court & Judiciary' }
];

// Complete Legal & Lok Sewa Passages for Legal Pack Practice
export const LEGAL_PASSAGES: LegalPassage[] = [
  {
    id: 'loksewa-model-set-1',
    title: 'Lok Sewa Model Question - Set 1 (बालअधिकार र महासन्धि)',
    nepaliTitle: 'लोक सेवा आयोग शाखा अधिकृत नमुना प्रश्न - सेट १ (बालअधिकार)',
    category: 'Lok Sewa Model Questions',
    difficulty: 'Intermediate',
    lengthCategory: 'Medium',
    wordCount: 220,
    keyTermsIncluded: ['बालबालिका', 'हकअधिकार', 'संरक्षण', 'महासन्धि', 'हस्ताक्षर', 'अनुमोदन', 'कानूनी', 'व्यवस्था'],
    description: 'Actual Section Officer Computer Skill Test model exam question passage on child rights and UN convention.',
    text: `बालबालिका कुनैपनि देशका भविष्यका आधारस्तम्भका साथसाथै कर्णधारपनि हुन्। यही कुरालाई आत्मसात गर्दै हरेक राज्यले बालिकाका लागि उचित स्याहारसुसार हकहितको संरक्षण सम्बर्द्धन गर्दै शिक्षा स्वास्थ्यको क्षेत्रमा व्यापक रुपमा लगानी गर्ने लक्ष्य लिएका हुन्छन्। बालबालिका भनेका भोलिका होनहार विकसित मस्तिष्क हुन् र यिनीहरुको उचित विकासमा समाज, समुदाय, राष्ट्र र विश्वकै सुरक्षा र विकास हुन्छ भन्ने मान्यता अनुरुप बालबालिकालाई विशेष स्याहार पुर्याउनुपर्ने आवश्यकता महसुस गरी २० नोभेम्बर १९५९ मा संयुक्त राष्ट्रसंघले ग्रहण गरेको घोषणापत्रमा बालबालिकाहरुको हकअधिकार सम्बन्धी विषय उल्लेख भएका छन्। तत्पश्चात मानवअधिकारको विश्वव्यापी घोषणापत्र नागरिक तथा राजनैतिक आर्थिक सामाजिक र सांस्कृतिक अधिकारसम्बन्धी प्रतिज्ञापत्र तथा बालबालिकाको कल्याणसँग सम्बन्धित विशिष्ट संस्था तथा अन्तराष्ट्रिय संस्थाहरुको विधान तथा दस्तावेजहरुमा बालअधिकारको संरक्षणको लागि विभिन्न नीतिगत, संरचनागत र प्रक्रियागत व्यवस्थाहरु बन्दै आएका छन्। यिनै परिप्रेक्ष्यमा बालबचाउ, बालसंरक्षण, बालविकास र बालसहभागिता हरेक बालबालिकाको शारीरिक, मानसिक, चारित्रिक विकासको लागि आवश्यक हुन्छ र त्यसको सुव्यवस्थाको लागि कानूनी लगायत विशेष संरक्षणको उति नै आवश्यकता पर्दछ भन्ने कुरालाई सबै व्यवस्थित पक्षहरुले हृदयंगम गरेका कारण सन् १९५९ को २० नोभेम्बरको दिन बालिका सम्बन्धी महासन्धिलाई संयुक्त राष्ट्रसंघको महासभाले ग्रहण गरी २ सेप्टेम्बर १९६० देखि हस्ताक्षर, अनुमोदन र सम्मलेनका लागि खुला गरियो। नेपालले उक्त महासन्धिमा १४ सेप्टेम्बर १९९० मा हस्ताक्षर गरी आफूलाई पक्ष राष्ट्रको सूचीमा दर्ता गरेको हो। ५४ धारा भएको यस महासन्धिले बालअधिकार माथि भनिएका ४ वटा बालबचाउ, बालसंरक्षण र बालसहभागिताको सम्बन्धको लागि विभिन्न व्यवस्था गरेको छ।`
  },
  {
    id: 'loksewa-model-set-2',
    title: 'Lok Sewa Model Question - Set 2 (व्यावसायिक नेतृत्व र अमेजन)',
    nepaliTitle: 'लोक सेवा आयोग शाखा अधिकृत नमुना प्रश्न - सेट २ (व्यावसायिक नेतृत्व)',
    category: 'Lok Sewa Model Questions',
    difficulty: 'Advanced',
    lengthCategory: 'Medium',
    wordCount: 215,
    keyTermsIncluded: ['प्राविधिक', 'सलाहकार', 'कम्पनी', 'उपभोक्ता', 'राजीनामा', 'नेतृत्व', 'व्यावसायिक', 'दूरदर्शी'],
    description: 'Actual Section Officer Computer Skill Test model question on tech leadership and organizational management.',
    text: `सन् २००४ मा जेफ बेजोस र उनका प्राविधिक सल्लाहार कोलिन ब्रायर सँगै कार चलाउँदै सिएटलभन्दा दक्षिणमा एक घण्टाको दूरीमा पर्ने टाकोमा सहरमा पुगे। त्यस समयमा अमेजन अर्बौं डलरको कम्पनी बनिसकेको थियो। यद्यपि उनीहरु अमेजनको ग्राहक सेवा केन्द्रतर्फ जाँदै थिए, जहाँ उनीहरुले ग्राहक सेवा एजेन्टको रुपमा दुई दिन बिताउनु थियो। उक्त यात्रामा बेजोसले आफ्नैबारेमा कुरा गरिरहेका थिए। ब्रायरका अनुसार अमेजनको एउटा प्रोडक्टको विषयमा उपभोक्ताका गुनासोहरु आइरहेका थिए। बेजोस दिक्क मानिरहेका थिए। उक्त प्रोडक्टमा केही गल्ती भएको स्पष्ट थियो तर त्यसलाई बढाइचढाइ गरिएन। सोही दिन उनले एक इमेल लेख्दै त्रुटिपूर्ण सामानहरु छुटाउनका लागि प्रभावकारी उपायहरु अवलम्बन गर्न आग्रह गरे। आफैले अमेजन कम्पनी स्थापना गरेको २७ वर्षपछि बेजोसले सोमबार कम्पनीको प्रमुख कार्यकारी अधिकृत पदबाट राजीनामा दिएका छन्। यसबीचमा उनले असाधारण नेतृत्व सिद्धान्तको श्रृंखलाबद्ध विकास गरे जुन उनको सफलताको मेरुदण्ड रहेको कतिपयको भनाइ छ। अमेजनमा काम गरेको जो कोहीसँग पनि कुराकानी गर्दा जेफ बेजोसको ग्राहकप्रतिको आशक्तिको चर्चा हुन्छ। बेजोसका लागि नाफा भनेको दीर्घकालीन प्रेरणाको विषय हो। कुनै पनि कम्पनी सफल हुनका लागि उनीसँग कुनैपनि मूल्यमा सन्तुष्ट ग्राहकहरु हुनु आवश्यक पर्दछ। तर बेजोससँग नजिक रहेर काम गरेका कसैले पनि उनलाई स्वार्थी तथा अरुको मतलब नभएको मान्छेको रुपमा चिनेका छैनन्। उनीहरुका लागि बेजोस एक व्यावसायिक दूरदर्शी व्यक्तित्व हुन्।`
  },
  {
    id: 'constitution-fundamental-rights',
    title: 'Constitution of Nepal - Fundamental Rights & Duties',
    nepaliTitle: 'नेपालको संविधान - मौलिक हक तथा नागरिक कर्तव्य (भाग ३)',
    category: 'Constitution',
    difficulty: 'Intermediate',
    lengthCategory: 'Short',
    wordCount: 145,
    keyTermsIncluded: ['संविधान', 'मौलिक हक', 'कर्तव्य', 'स्वतन्त्रता', 'समानता', 'न्याय', 'सार्वभौमसत्ता'],
    description: 'Articles on Right to Live with Dignity, Freedom, Equality, and Fundamental Duties under Nepal Constitution 2072.',
    text: `नेपालको संविधानको भाग ३ मा नागरिकका मौलिक हक तथा कर्तव्य सम्बन्धी विस्तृत संवैधानिक व्यवस्था गरिएको छ। धारा १६ बमोजिम प्रत्येक व्यक्तिलाई सम्मानपूर्वक बाँच्न पाउने हक हुनेछ र कसैलाई पनि मृत्युदण्डको सजाय दिने गरी कानून बनाइने छैन। धारा १७ मा वैयक्तिक स्वतन्त्रता, विचार र अभिव्यक्तिको स्वतन्त्रता, बिना हातहतियार शान्तिपूर्वक भेला हुने स्वतन्त्रता, संघ संस्था खोल्ने स्वतन्त्रता तथा नेपालको कुनै पनि भागमा आवतजावत र बसोबास गर्ने स्वतन्त्रता प्रदान गरिएको छ। धारा १८ बमोजिम सबै नागरिक कानूनको दृष्टिमा समान हुनेछन् र कसैलाई पनि उत्पत्ति, धर्म, वर्ण, जात, लिङ्ग, वा विचारका आधारमा भेदभाव गरिने छैन। धारा २० मा न्याय सम्बन्धी हक अन्तर्गत पक्राउ परेको व्यक्तिलाई पक्राउ परेको कारणसहितको सूचना नदिई हिरासतमा राखिने छैन र २४ घण्टाभित्र मुद्दा हेर्ने अधिकारी समक्ष उपस्थित गराउनुपर्ने संवैधानिक ग्यारेन्टी गरिएको छ। धारा ४८ मा राष्ट्रप्रति निष्ठावान हुँदै राष्ट्रियता, सार्वभौमसत्ता र अखण्डताको रक्षा गर्नु, संविधान र कानूनको पालना गर्नु तथा सार्वजनिक सम्पत्तिको सुरक्षा गर्नु प्रत्येक नागरिकको कर्तव्य हुनेछ भनी उल्लेख गरिएको छ।`
  },
  {
    id: 'supreme-court-writs-jurisdiction',
    title: 'Supreme Court Writ Jurisdiction & Constitutional Order',
    nepaliTitle: 'सर्वोच्च अदालतको असाधारण अधिकारक्षेत्र र रिट आदेशहरू',
    category: 'Court & Judiciary',
    difficulty: 'Advanced',
    lengthCategory: 'Medium',
    wordCount: 230,
    keyTermsIncluded: ['सर्वोच्च अदालत', 'उत्प्रेषण', 'परमादेश', 'अधिकारक्षेत्र', 'मौलिक हक', 'अन्तरिम आदेश', 'अदालतको अवहेलना'],
    description: 'Passage on Supreme Court writ remedies, Constitutional bench jurisdiction, and judicial enforcement.',
    text: `सम्माननीय सर्वोच्च अदालतको संवैधानिक इजलासबाट उत्प्रेषण, परमादेश तथा प्रतिषेधको आदेश जारी गर्ने सम्बन्धी पुनरावेदन तथा रिट निवेदनमा महत्वपूर्ण कानूनी सिद्धान्त प्रतिपादन भएको छ। नेपालको संविधानको धारा १३३ को उपधारा (२) र (३) बमोजिम सर्वोच्च अदालतलाई मौलिक हकको प्रचलन गराउन वा कानूनी त्रुटि सच्याउन आवश्यक आदेश जारी गर्ने असाधारण अधिकारक्षेत्र प्राप्त छ। कानूनको शासन र संवैधानिक सर्वोच्चताको संरक्षण गर्नु न्यायपालिकाको प्रमुख संवैधानिक जिम्मेवारी हो। कुनै पनि सार्वजनिक निकाय वा पदाधिकारीले आफ्नो अधिकारक्षेत्र नाघेर वा क्षेत्राधिकार विहीन भई गरेको निर्णय स्वेच्छाचारी, असंवैधानिक तथा गैरकानूनी ठहरिएमा त्यस्तो कार्यलाई उत्प्रेषणको आदेशद्वारा बदर गरी सही कानूनी प्रक्रिया अपनाउन परमादेशको आदेश जारी गरिन्छ। मुद्दाको कारबाही चलिरहेको अवस्थामा पक्षहरूको हकहितमा गम्भीर क्षति पुग्न सक्ने सम्भावना देखिएमा अदालतले अन्तरिम आदेश समेत जारी गर्न सक्दछ। न्यायमा सर्वसाधारणको सहज र सरल पहुँच अभिवृद्धि गर्न सार्वजनिक सरोकारको विवादमा हकदयाको दायरालाई लचिलो बनाइएको छ। प्राकृतिक न्यायको सिद्धान्त अनुरूप दुवै पक्षलाई सुनुवाइको उचित मौका नदिई गरिएको फैसला वा अन्तिम निर्णय कानूनी दृष्टिमा शून्य मानिन्छ। अदालतबाट सम्पादित फैसला र जारी भएका आदेशहरूको पूर्ण निष्ठाका साथ कार्यान्वयन गर्नु कार्यपालिका, प्रशासनिक निकाय तथा सबै नागरिकहरूको कानूनी कर्तव्य हो।`
  },
  {
    id: 'civil-and-criminal-code',
    title: 'Civil & Criminal Codes (मुलुकी देवानी तथा फौजदारी संहिता)',
    nepaliTitle: 'मुलुकी देवानी र फौजदारी संहिताको सर्वमान्य सिद्धान्त',
    category: 'Civil & Criminal',
    difficulty: 'Beginner',
    lengthCategory: 'Short',
    wordCount: 110,
    keyTermsIncluded: ['मुलुकी', 'देवानी', 'फौजदारी', 'कसुर', 'सजाय', 'धरौटी', 'पुनरावेदन', 'प्रमाण'],
    description: 'Fundamental principles of Nepal Civil Code and Criminal Code, bail provisions, and prosecution.',
    text: `मुलुकी देवानी संहिता र मुलुकी फौजदारी संहिता नेपालको कानूनी इतिहासमा महत्त्वपूर्ण कोशढुङ्गा मानिन्छन्। मुलुकी देवानी संहिताले व्यक्ति, परिवार, करार, सम्पत्ति तथा देवानी दायित्व सम्बन्धी सर्वमान्य कानूनी सिद्धान्तहरूलाई व्यवस्थित गरेको छ। उता मुलुकी अपराध संहिताले कसुर र सजायको सिद्धान्त, फौजदारी दायित्व, धरौटी, थुना, सजायको निर्धारण तथा पुनरावेदनको कार्यविधिलाई स्पष्ट पारेको छ। कुनै पनि कसुर प्रमाणित नभएसम्म अभियुक्तलाई निर्दोष मानिने फौजदारी न्यायको सर्वमान्य सिद्धान्त हो। अदालतमा पेस गरिएका प्रमाण, साक्षीको बयान र अभियोगपत्रको आधारमा निष्पक्ष सुनुवाइ गरी कानूनी फैसला गरिन्छ।`
  },
  {
    id: 'court-procedures-legal-drafting',
    title: 'Court Procedures & Legal Document Drafting',
    nepaliTitle: 'अदालती कार्यविधि, लिखत ढाँचा र फिरादपत्र',
    category: 'Court Procedures',
    difficulty: 'Intermediate',
    lengthCategory: 'Short',
    wordCount: 125,
    keyTermsIncluded: ['वादी', 'प्रतिवादी', 'फिरादपत्र', 'प्रतिउत्तरपत्र', 'दफा', 'उपदफा', 'म्याद', 'तारिख', 'मिसिल'],
    description: 'Legal document drafting techniques, Section clauses, filing procedures, and court schedule management.',
    text: `अदालती कार्यविधिमा वादीले दायर गरेको फिरादपत्र र प्रतिवादीले पेस गरेको प्रतिउत्तरपत्र मुद्दाका मुख्य आधारस्तम्भ हुन्। लिखत ढाँचा तयार गर्दा दफा, उपदफा, कानूनी आधार, घटनाको विवरण, प्रमाण कागजपत्र तथा माग दाबीलाई सिलसिलेवार रूपमा प्रस्तुत गर्नुपर्छ। अदालतबाट जारी हुने म्याद तामेल, तारिख, प्रतिवेदन, साक्षी बकपत्र, र मिसिल अध्ययनले न्याय निरूपण प्रक्रियालाई निष्पक्ष र वस्तुनिष्ठ बनाउँछ। लिखत तयारीमा कानूनी शुद्धता र व्याकरणको स्पष्टता अपरिहार्य मानिन्छ। न्यायधीशद्वारा प्रमाणको मूल्याङ्कन गरी फैसला सुनाइन्छ।`
  },
  {
    id: 'civil-service-public-governance',
    title: 'Civil Service Act, Governance & Public Administration',
    nepaliTitle: 'निजामती सेवा ऐन, लोक सेवा आयोग र सुशासन',
    category: 'Public Administration',
    difficulty: 'Intermediate',
    lengthCategory: 'Medium',
    wordCount: 180,
    keyTermsIncluded: ['निजामती', 'लोक सेवा आयोग', 'सुशासन', 'पारदर्शिता', 'जवाफदेहिता', 'शाखा अधिकृत', 'नायब सुब्बा'],
    description: 'Role of Public Service Commission, meritocracy, transparent administration, and civil service typing skill test.',
    text: `नेपालको प्रशासनिक प्रणालीमा सुशासन प्रवर्धन र जनसेवा प्रवाहलाई प्रभावकारी बनाउन निजामती सेवाको महत्त्वपूर्ण भूमिका रहेको छ। निजामती सेवा ऐन र नियमावली बमोजिम लोक सेवा आयोगले खुला तथा समावेशी प्रतियोगितात्मक परीक्षाद्वारा योग्य, सक्षम र निष्पक्ष कर्मचारीको छनोट गर्दछ। लोक सेवा आयोगबाट सञ्चालन हुने कम्प्युटर सिप परीक्षण र प्रयोगात्मक परीक्षामा उच्च गति, शुद्धता र कार्यकुशलता प्रदर्शन गर्नु परीक्षार्थीका लागि अनिवार्य हुन्छ। प्रशासनिक निर्णय प्रक्रियामा पारदर्शिता, जवाफदेहिता, व्यावसायिक निष्ठा, र निष्पक्षता सुशासनका मुख्य आधारस्तम्भ हुन्। शाखा अधिकृत, नायब सुब्बा तथा खरिदार पदको परीक्षामा सफलता हासिल गर्न परीक्षार्थीले नेपालको प्रशासनिक व्यवस्था, संवैधानिक निकाय, ऐन कानुन, र समसामयिक विषयहरूको गहन ज्ञानका साथै टाइपिंग अभ्यासमा निरन्तरता दिनु आवश्यक छ। निजामती कर्मचारीले राष्ट्रिय हित, नागरिक अधिकार र कानूनको शासनप्रति प्रतिबद्ध भई कार्यसम्पादन गर्नुपर्छ।`
  },
  {
    id: 'supreme-court-full-bench-expert',
    title: 'Supreme Court Full Bench Precedent & Jurisprudence (Expert Level)',
    nepaliTitle: 'विज्ञ स्तर: सर्वोच्च अदालतको पूर्ण इजलासको नजिर र न्यायिक सिद्धान्त',
    category: 'Court & Judiciary',
    difficulty: 'Expert',
    lengthCategory: 'Long',
    wordCount: 260,
    keyTermsIncluded: ['सर्वोच्च अदालत', 'पूर्ण इजलास', 'नजिर', 'पुनरावलोकन', 'प्राकृतिक न्याय', 'विधायिका', 'हकदया'],
    description: 'Complex judicial precedent passage for expert level typing practice with sophisticated court terminology.',
    text: `सम्माननीय सर्वोच्च अदालतको पूर्ण इजलासबाट प्रतिपादित सिद्धान्त अनुसार कानूनको व्याख्या गर्दा विधायिकाको मनसाय, संवैधानिक भावना र सर्वसाधारणको न्याय प्राप्त गर्ने अधिकारलाई मूल मार्गदर्शन मान्नुपर्छ। संविधानको मर्म र मुलुकी ऐनका प्रावधानहरू आपसमा बाझिएको अवस्थामा संविधान नै सर्वोच्च हुनेछ। न्यायपालिकाको मुख्य दायित्व नागरिकका मौलिक हक र स्वतन्त्रताको रक्षा गर्नु हो। पुनरावेदन अदालत तथा जिल्ला अदालतहरूबाट भएका फैसलाहरूको न्यायिक पुनरावलोकन गर्दा प्रमाणको मूल्याङ्कन, साक्षीको बयान, र प्रमाण ऐनका सिद्धान्तहरूलाई सुक्ष्म रूपमा परीक्षण गरिन्छ। कसुरदारलाई सजाय दिँदा कसुरको गम्भीरता, अपराध गर्दाको परिस्थिति, र क्षतिपूर्तिको आवश्यकतालाई ध्यानमा राखिनुपर्छ। फौजदारी मुद्दामा शंकाको सुविधा अभियुक्तले पाउने सर्वमान्य सिद्धान्त छ भने देवानी मुद्दामा प्रमाणको बाहुल्यताका आधारमा फैसला गरिन्छ। अदालतका फैसलाहरू नजिरका रूपमा मातहतका सबै अदालतहरूका लागि बन्धनकारी हुन्छन्। नजिरको पालनाले न्याय सम्पादनमा एकरूपता, निश्चितता र विश्वसनीयता कायम गर्दछ। सार्वजनिक सरोकारका विवादहरूमा सर्वोच्च अदालतले परमादेश, प्रतिषेध, उत्प्रेषण, अधिकारपृच्छा र बन्दीप्रत्यक्षीकरण जस्ता रिट जारी गरी संवैधानिक हकको संरक्षण गर्दै आएको छ। अतः कानूनी सचेतना, निष्पक्ष अनुसन्धान, सक्षम अभियोजन, र स्वतन्त्र न्यायपालिका नै न्यायपूर्ण समाज निर्माणका अनिवार्य पूर्वसर्त हुन्।`
  }
];

// Interactive Practice Modules for Practice Mode
export const PRACTICE_MODULES: PracticeModule[] = [
  {
    id: 'vowels',
    title: 'Vowels (स्वर वर्ण)',
    nepaliTitle: 'स्वर वर्ण अभ्यास',
    category: 'vowels',
    items: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'],
    description: 'Master independent Devanagari vowels from अ to अः.'
  },
  {
    id: 'consonants',
    title: 'Consonants (व्यञ्जन वर्ण)',
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
    items: [
      'का', 'कि', 'की', 'कु', 'कू', 'के', 'कै', 'को', 'कौ', 'कं', 'कः',
      'गा', 'गि', 'गी', 'गु', 'गू', 'गे', 'गै', 'गो', 'गौ', 'गं', 'गः',
      'ता', 'ति', 'ती', 'तु', 'तू', 'ते', 'तै', 'तो', 'तौ', 'तं', 'तः',
      'मा', 'मि', 'मी', 'मु', 'मू', 'मे', 'मै', 'मो', 'मौ', 'मं', 'मः',
      'सा', 'सि', 'सी', 'सु', 'सू', 'से', 'सै', 'सो', 'सौ', 'सं', 'सः'
    ],
    description: 'Practice attaching vowel signs (मात्रा) to consonants.'
  },
  {
    id: 'half_letters',
    title: 'Half Letters (आधा अक्षर)',
    nepaliTitle: 'आधा अक्षर अभ्यास',
    category: 'half-letters',
    items: ['क्', 'ख्', 'ग्', 'घ्', 'च्', 'छ्', 'ज्', 'झ्', 'त्', 'थ्', 'द्', 'ध्', 'न्', 'प्', 'फ्', 'ब्', 'भ्', 'म्', 'स्', 'ष्', 'श्', 'ल्', 'र्'],
    description: 'Practice half letters used for conjuncts and halants.'
  },
  {
    id: 'conjuncts',
    title: 'Conjunct Letters (संयुक्त वर्ण)',
    nepaliTitle: 'संयुक्त वर्ण अभ्यास (विस्तृत)',
    category: 'conjuncts',
    items: [
      'क्ष', 'त्र', 'ज्ञ', 'श्र', 'द्ध', 'द्व', 'द्य', 'ष्ट', 'ष्ठ',
      'न्त', 'म्प', 'क्त', 'त्त', 'ङ्क', 'ङ्ग', 'ञ्च', 'म्भ', 'ल्प',
      'ष्ट्र', 'न्द्र', 'ष्ट्य', 'ष्ठ्य', 'क्ष्म', 'न्द्य', 'न्त्य', 'प्र',
      'द्र', 'क्र', 'स्र', 'ट्ट', 'ठ्ठ', 'ड्ड', 'ढ्ढ', 'क्क', 'च्च', 'ज्झ',
      'ऋ', 'ॐ', 'ह्र', 'हृ', 'ह्न', 'ह्य'
    ],
    description: 'Master complex Devanagari conjuncts (क्ष, त्र, ज्ञ, श्र, द्ध, द्व, ष्ट, ष्ट्र, etc.).'
  },
  {
    id: 'legal_terms',
    title: 'Legal Vocabulary Practice (कानूनी शब्दावली)',
    nepaliTitle: 'कानूनी शब्दावली अभ्यास',
    category: 'legal',
    items: LEGAL_TERMS_PACK.map(t => t.devanagari),
    description: 'Essential single-word legal vocabulary drill for Judiciary & Lok Sewa examinations.'
  }
];

export const SAMPLE_PARAGRAPHS = {
  constitution: LEGAL_PASSAGES[2].text,
  supreme_court_judgment: LEGAL_PASSAGES[3].text,
  legal_newspaper: LEGAL_PASSAGES[6].text,
  general_quote: `संसारमा सबैभन्दा ठूलो शक्ति सत्य र अहिंसा हो। ज्ञान नै सबैभन्दा ठूलो धन हो, र न्याय नै समाजको वास्तविक आधार हो। निरन्तर अभ्यासले मात्र मानिसलाई दक्षता र सफलताको शिखरमा पुर्याउँछ।`
};
