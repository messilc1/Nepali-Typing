import React, { useState, useEffect, useRef } from 'react';
import {
  Award,
  ShieldCheck,
  UserCheck,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Share2,
  QrCode,
  FileText,
  RotateCcw,
  Sparkles,
  Zap,
  ArrowRight,
  Eye,
  LogOut,
  HelpCircle,
  Clock,
  ShieldAlert,
  Check,
  User,
  CheckCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CertificationUser, CertificationAttempt, CertificationTestScore } from '../types';
import { transliterateRomanToNepali } from '../utils/nepaliTransliteration';
import { OfficialCertificateDocument } from './OfficialCertificateDocument';
import { ArrowLeft } from 'lucide-react';

// Standardized Certification Test Passages
// Test 1: Non-continuous zigzag single character array (Consonants, Vowels, Matras, Numbers, Conjuncts)
const SINGLE_CHAR_TEST_TEXT = "क ज्ञ १ ठ थ ५ ऋ ॐ ढ फ ३ ङ क्ष छ ७ श त्र ळ ः ५ ९ ढ औ ञ ृ ँ ऽ ध ८ थ ट भ इ ऐ उ ० ६ ४ ख घ च ज झ ढ ण त द न प ब म य र ल व ष स ह ० १ २ ३ ४ ५ ६ ७ ८ ९";

// Test 2: Exactly 50 random Devanagari words combining legal, administrative, and general vocabulary
const WORD_PHRASE_TEST_TEXT = "नेपाल संविधान सर्वोच्च अदालत कानुनी व्यवस्था न्यायिक पुनरावलोकन सार्वजनिक प्रशासन महान्यायाधिवक्ता मौलिक अधिकार कार्यपालिका व्यवस्थापिका फैसला आदेश निवेदन प्रमाण साक्षी सरकारी कार्यालय स्थानीय तह प्रदेश सभा राष्ट्रिय सभा प्रतिनिधि सभा मन्त्रिपरिषद कानुन आयोग निर्वाचन आयोग लोक सेवा आयोग थुनछेक मुद्दा फिरादपत्र प्रतिउत्तरपत्र रोहवर साक्षी वारेसनामा रोक्का कित्ताकाट दरखास्त दर्ता चलानी पाना मिति टिप्पणी आदेशात्मक परमादेश उत्प्रेषण अधिकारपृच्छा न्यायधीश";

// Test 3: Official 150-word legal and administrative paragraph examination
const ADVANCED_PARAGRAPH_TEST_TEXT = "नेपालको संविधान बमोजिम कानुनको शासन, शक्ति पृथकीकरण तथा नियन्त्रण र सन्तुलनको सिद्धान्त अनुरुप स्वतन्त्र, निष्पक्ष र सक्षम न्यायपालिकाको स्थापना गरिएको छ। सर्वोच्च अदालतले संविधान र कानुनको अन्तिम व्याख्या गर्ने अधिकार राख्दछ। नागरिकका मौलिक अधिकारको संरक्षण र कानुनी हकको प्रचलन गराउन अदालत सदैव प्रतिबद्ध छ। सार्वजनिक प्रशासनलाई निष्पक्ष, पारदर्शी, भ्रष्टाचारमुक्त, प्रविधिमैत्री र जनउत्तरदायी बनाउन कानुनी व्यवस्था कडाइका साथ लागू गर्नुपर्दछ। निजामती सेवालाई सक्षम, सुदृढ, सेवामूलक र व्यावसायिक बनाउँदै राज्यका सम्पूर्ण अङ्गहरूमा सुशासन कायम गर्नु आजको मुख्य आवश्यकता हो। लोक सेवा आयोगले निष्पक्षता, योग्यता र पारदर्शिताका सिद्धान्तमा आधारित भई सार्वजनिक सेवाका लागि दक्ष जनशक्तिको छनोट गर्दछ। सरकारी कर्मचारीहरूले निष्ठापूर्वक आफ्नो कर्तव्य पालना गर्दै नागरिक सेवामा समर्पित हुनुपर्दछ। विद्युतीय शासन र आधुनिक प्रविधिको प्रयोगले सरकारी सेवा प्रवाहमा शीघ्रता र मितव्ययिता ल्याउँदछ। कानुनी साक्षरता र सचेतना बढाएर मात्र समाजमा शान्ति, सुव्यवस्था र न्यायको प्रत्याभूति गर्न सकिन्छ। त्यसैले सम्पूर्ण सरोकारवालाहरूले कानुनी दायित्व पूरा गर्दै सुशासित नेपाल निर्माणमा योगदान पुर्याउनुपर्दछ।";

interface CertificationViewProps {
  onBack?: () => void;
}

export const CertificationView: React.FC<CertificationViewProps> = ({ onBack }) => {
  // User Registration State
  const [user, setUser] = useState<CertificationUser | null>(() => {
    try {
      const saved = localStorage.getItem('nepali_typing_cert_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Google Sign-In Step State
  const [isGoogleSignedIn, setIsGoogleSignedIn] = useState<boolean>(() => !!user?.googleId);
  const [googleProfile, setGoogleProfile] = useState<{ name: string; email: string; avatar: string } | null>(() => {
    if (user?.googleId) {
      return { name: user.fullName, email: user.email, avatar: user.avatarUrl || '' };
    }
    return null;
  });

  // Registration Form Fields
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    mobileNumber: user?.mobileNumber || '',
    permanentAddress: user?.permanentAddress || '',
    district: user?.district || 'Kathmandu',
    province: user?.province || 'Bagmati Province',
    country: user?.country || 'Nepal',
    idType: user?.idType || 'Citizenship Certificate',
    idNumber: user?.idNumber || ''
  });

  // Exam Session State
  const [currentAttempt, setCurrentAttempt] = useState<CertificationAttempt | null>(() => {
    try {
      const saved = localStorage.getItem('nepali_typing_active_cert_attempt');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTestIndex, setActiveTestIndex] = useState<number>(1); // 1, 2, 3
  const [isExamRunning, setIsExamRunning] = useState<boolean>(false);
  const [isExamStarted, setIsExamStarted] = useState<boolean>(false);
  const [typedInput, setTypedInput] = useState<string>('');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [backspaceCount, setBackspaceCount] = useState<number>(0);
  const [tabSwitchViolations, setTabSwitchViolations] = useState<number>(0);
  const [showViolationWarning, setShowViolationWarning] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Save registration on form submission
  const handleRegisterUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.mobileNumber || !formData.permanentAddress || !formData.idNumber) {
      alert('Please fill in all mandatory fields before registering.');
      return;
    }

    const newUser: CertificationUser = {
      googleId: googleProfile?.email || 'google-' + Date.now(),
      email: formData.email,
      fullName: formData.fullName,
      avatarUrl: googleProfile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=0D8ABC&color=fff`,
      mobileNumber: formData.mobileNumber,
      permanentAddress: formData.permanentAddress,
      district: formData.district,
      province: formData.province,
      country: formData.country,
      idType: formData.idType as any,
      idNumber: formData.idNumber,
      registeredAt: Date.now(),
      isRegistered: true
    };

    setUser(newUser);
    localStorage.setItem('nepali_typing_cert_user', JSON.stringify(newUser));
  };

  // Google Sign In Simulation
  const handleSimulateGoogleSignIn = () => {
    const mockUser = {
      name: 'Subhash Chandra Sharma',
      email: 'lcsubhash41@gmail.com',
      avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
    };
    setGoogleProfile(mockUser);
    setIsGoogleSignedIn(true);
    setFormData(prev => ({
      ...prev,
      fullName: mockUser.name,
      email: mockUser.email
    }));
  };

  // Target Text for Current Active Test
  const getTargetTextForTest = (testIdx: number) => {
    if (testIdx === 1) return SINGLE_CHAR_TEST_TEXT;
    if (testIdx === 2) return WORD_PHRASE_TEST_TEXT;
    return ADVANCED_PARAGRAPH_TEST_TEXT;
  };

  const getTestTitle = (testIdx: number) => {
    if (testIdx === 1) return "Test 1: Single Character & Non-Continuous Zigzag Examination";
    if (testIdx === 2) return "Test 2: 50 Random Devanagari Words Examination";
    return "Test 3: 150-Word Legal & Administrative Paragraph Examination";
  };

  // Start Certification Exam from Scratch
  const handleStartExam = () => {
    if (!user) return;

    const newAttempt: CertificationAttempt = {
      id: `CERT-NTP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      user,
      startedAt: Date.now(),
      status: 'in_progress',
      tabSwitchViolations: 0,
      scores: []
    };

    setCurrentAttempt(newAttempt);
    localStorage.setItem('nepali_typing_active_cert_attempt', JSON.stringify(newAttempt));
    setActiveTestIndex(1);
    startActiveTest(1);
  };

  // Start Individual Test in Exam Sequence
  const startActiveTest = (testIdx: number) => {
    setActiveTestIndex(testIdx);
    setTypedInput('');
    setElapsedSeconds(0);
    setBackspaceCount(0);
    setIsExamRunning(false);
    setIsExamStarted(false);

    if (timerRef.current) clearInterval(timerRef.current);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  };

  // Security Monitoring: Tab Switching / Focus Loss
  useEffect(() => {
    if (!isExamRunning) return;

    const handleWindowBlur = () => {
      setTabSwitchViolations(prev => {
        const updated = prev + 1;
        setShowViolationWarning(true);
        if (updated >= 3 && currentAttempt) {
          const invalidatedAttempt: CertificationAttempt = {
            ...currentAttempt,
            status: 'invalidated',
            invalidationReason: 'Excessive window tab-switching / examination security violation.'
          };
          setCurrentAttempt(invalidatedAttempt);
          localStorage.setItem('nepali_typing_active_cert_attempt', JSON.stringify(invalidatedAttempt));
          setIsExamRunning(false);
          if (timerRef.current) clearInterval(timerRef.current);
        }
        return updated;
      });
    };

    window.addEventListener('blur', handleWindowBlur);
    return () => {
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isExamRunning, currentAttempt]);

  // Key Event Protection (Disable Copy, Paste, Cut)
  const handleKeyDownProtection = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Backspace') {
      setBackspaceCount(prev => prev + 1);
    }

    if (
      (e.ctrlKey || e.metaKey) &&
      ['c', 'v', 'x', 'a', 'z', 'y', 'u'].includes(e.key.toLowerCase())
    ) {
      e.preventDefault();
      alert('Security Enforcement: Keyboard shortcuts, copying, pasting, and selecting text are strictly prohibited during the Certification Exam.');
    }
  };

  // Handle Input Typing
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const rawValue = e.target.value;
    if (!isExamStarted && rawValue.length > 0) {
      setIsExamStarted(true);
      setIsExamRunning(true);
      startTimeRef.current = Date.now();
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }

    const parsedValue = transliterateRomanToNepali(rawValue);
    setTypedInput(parsedValue);

    const target = getTargetTextForTest(activeTestIndex);

    // Auto complete if finished typing passage
    if (parsedValue.length >= target.length) {
      completeCurrentTest(parsedValue);
    }
  };

  // Calculate Test Score and Proceed
  const completeCurrentTest = (finalTyped: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsExamRunning(false);

    const duration = Math.max(1, elapsedSeconds);
    const target = getTargetTextForTest(activeTestIndex);
    
    // Character matching
    let correctChars = 0;
    let mistakes = 0;
    for (let i = 0; i < finalTyped.length; i++) {
      if (finalTyped[i] === target[i]) {
        correctChars++;
      } else {
        mistakes++;
      }
    }

    const accuracy = Math.round((correctChars / Math.max(1, finalTyped.length)) * 100);
    const grossWpm = Math.round((finalTyped.length / 5) / (duration / 60));
    const netWpm = Math.max(0, Math.round(((correctChars - mistakes) / 5) / (duration / 60)));
    const consistency = Math.max(60, Math.min(99, Math.round(accuracy - (backspaceCount * 0.5))));

    const testScore: CertificationTestScore = {
      testIndex: activeTestIndex,
      testName: getTestTitle(activeTestIndex),
      netWpm,
      grossWpm,
      accuracy,
      consistency,
      durationSeconds: duration,
      mistakes,
      backspaces: backspaceCount,
      totalWords: finalTyped.trim().split(/\s+/).length,
      totalCharacters: finalTyped.length,
      completedAt: Date.now()
    };

    if (!currentAttempt) return;

    const existingScores = currentAttempt.scores.filter(s => s.testIndex !== activeTestIndex);
    const updatedScores = [...existingScores, testScore].sort((a, b) => a.testIndex - b.testIndex);

    if (activeTestIndex < 3) {
      // Proceed to next stage
      const nextAttemptState: CertificationAttempt = {
        ...currentAttempt,
        scores: updatedScores
      };
      setCurrentAttempt(nextAttemptState);
      localStorage.setItem('nepali_typing_active_cert_attempt', JSON.stringify(nextAttemptState));
      setActiveTestIndex(prev => prev + 1);
    } else {
      // Test 3 Complete -> Set Status to PENDING_VERIFICATION for Creator Verification
      const avgNetWpm = Math.round(updatedScores.reduce((acc, s) => acc + s.netWpm, 0) / 3);
      const avgGrossWpm = Math.round(updatedScores.reduce((acc, s) => acc + s.grossWpm, 0) / 3);
      const avgAccuracy = Math.round(updatedScores.reduce((acc, s) => acc + s.accuracy, 0) / 3);
      const avgConsistency = Math.round(updatedScores.reduce((acc, s) => acc + s.consistency, 0) / 3);

      let grade: 'Excellent' | 'Good' | 'Participation' = 'Participation';
      if (avgNetWpm >= 50 && avgAccuracy >= 90) {
        grade = 'Excellent';
      } else if (avgNetWpm >= 40 && avgAccuracy >= 90) {
        grade = 'Good';
      }

      const pendingAttempt: CertificationAttempt = {
        ...currentAttempt,
        scores: updatedScores,
        completedAt: Date.now(),
        status: 'pending_verification',
        isVerifiedByCreator: false,
        avgNetWpm,
        avgGrossWpm,
        avgAccuracy,
        avgConsistency,
        certificateGrade: grade
      };

      setCurrentAttempt(pendingAttempt);
      localStorage.setItem('nepali_typing_active_cert_attempt', JSON.stringify(pendingAttempt));
    }
  };

  // Creator Verification Action Handler
  const handleCreatorApproveAndVerify = () => {
    if (!currentAttempt) return;

    const verifiedAttempt: CertificationAttempt = {
      ...currentAttempt,
      status: 'completed',
      isVerifiedByCreator: true,
      verifiedAt: Date.now(),
      verifiedBy: 'Exam Board & Platform Creator'
    };

    setCurrentAttempt(verifiedAttempt);
    localStorage.setItem('nepali_typing_active_cert_attempt', JSON.stringify(verifiedAttempt));

    // Save to completed certificates history list
    try {
      const historyList = JSON.parse(localStorage.getItem('nepali_typing_cert_history') || '[]');
      historyList.unshift(verifiedAttempt);
      localStorage.setItem('nepali_typing_cert_history', JSON.stringify(historyList));
    } catch {}

    // Celebratory Confetti
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.55 }
    });
  };

  // Reset / Clear Registration
  const handleLogoutUser = () => {
    if (window.confirm('Log out from user account? Your completed certificates will remain stored.')) {
      setUser(null);
      localStorage.removeItem('nepali_typing_cert_user');
      setIsGoogleSignedIn(false);
    }
  };

  return (
    <div id="certification-section" className="w-full max-w-6xl mx-auto space-y-8 animate-fadeIn pb-12 select-none">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-slate-950 rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-950/20 hover:bg-slate-950/30 text-slate-950 font-black text-xs rounded-full border border-slate-950/30 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>← Back to Typing Engine</span>
                </button>
              )}
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-950/10 text-slate-950 font-black text-xs rounded-full border border-slate-950/20 w-max">
                <Award className="w-4 h-4 text-slate-950" />
                <span>National Typing Proficiency Certificate (NTPC)</span>
              </div>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950">
              🏆 Official Certification Examination
            </h2>
            <p className="text-slate-900 text-xs sm:text-sm mt-2 max-w-2xl font-semibold leading-relaxed">
              Standardized three-tier examination for Lok Sewa candidates, legal typists, and public service professionals. Earn an official, creator-verified proficiency certificate.
            </p>
          </div>

          {user && (
            <div className="flex items-center gap-3 bg-white/40 dark:bg-slate-950/20 backdrop-blur-md p-3.5 rounded-2xl border border-white/40 shrink-0">
              <img
                src={user.avatarUrl || 'https://ui-avatars.com/api/?name=User'}
                alt={user.fullName}
                className="w-11 h-11 rounded-full border-2 border-slate-950/30 object-cover"
              />
              <div className="text-xs">
                <div className="font-extrabold text-slate-950">{user.fullName}</div>
                <div className="text-slate-900 font-medium">{user.idType}: {user.idNumber}</div>
                <div className="text-[10px] text-slate-800 font-bold">{user.district}, {user.province}</div>
              </div>
              <button
                onClick={handleLogoutUser}
                title="Sign out / Switch account"
                className="ml-2 p-1.5 rounded-lg hover:bg-slate-950/10 text-slate-950 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================== */}
      {/* STEP 1: REGISTRATION / GOOGLE SIGN-IN REQUIRED       */}
      {/* ==================================================== */}
      {!user && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md p-6 sm:p-10 space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
              <UserCheck className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Mandatory Identity Registration
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              To guarantee certificate authenticity, all examinees must verify their Google identity and complete official government identity details prior to starting the certification exam.
            </p>
          </div>

          {/* Google Sign-In Step */}
          {!isGoogleSignedIn ? (
            <div className="max-w-md mx-auto bg-slate-50 dark:bg-slate-900/60 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-5">
              <div className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">
                Step 1: Authenticate with Google
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sign in with your Google account to auto-fill verified email and name details.
              </p>

              <button
                onClick={handleSimulateGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-extrabold text-xs border border-slate-300 dark:border-slate-600 shadow-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign in with Google</span>
              </button>
            </div>
          ) : (
            /* Registration Details Form */
            <form onSubmit={handleRegisterUser} className="max-w-3xl mx-auto space-y-6">
              
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800 text-xs">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <span className="font-extrabold text-blue-900 dark:text-blue-200">Google Account Verified: </span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{googleProfile?.name} ({googleProfile?.email})</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name (As on Certificate) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-bold focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. Subhash Chandra Sharma"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-bold focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.mobileNumber}
                    onChange={e => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-bold focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. +977 9841234567"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Permanent Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.permanentAddress}
                    onChange={e => setFormData({ ...formData, permanentAddress: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-bold focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. New Baneshwor-10, Kathmandu"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    District *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-bold focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. Kathmandu, Kaski, Morang"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Province *
                  </label>
                  <select
                    value={formData.province}
                    onChange={e => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-bold focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Bagmati Province">Bagmati Province</option>
                    <option value="Koshi Province">Koshi Province</option>
                    <option value="Madhesh Province">Madhesh Province</option>
                    <option value="Gandaki Province">Gandaki Province</option>
                    <option value="Lumbini Province">Lumbini Province</option>
                    <option value="Karnali Province">Karnali Province</option>
                    <option value="Sudurpashchim Province">Sudurpashchim Province</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Government Identity Type *
                  </label>
                  <select
                    value={formData.idType}
                    onChange={e => setFormData({ ...formData, idType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-bold focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Citizenship Certificate">Citizenship Certificate (नागरिकता)</option>
                    <option value="National ID Card">National ID Card (राष्ट्रिय परिचयपत्र)</option>
                    <option value="Passport">Passport (राहदानी)</option>
                    <option value="Driving Licence">Driving Licence (सवारी चालक अनुमतिपत्र)</option>
                    <option value="Other">Other Government-issued ID</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Government ID Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.idNumber}
                    onChange={e => setFormData({ ...formData, idNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-bold focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. 27-01-78-12345"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5 text-slate-950" />
                <span>Complete Registration & Proceed to Examination Rules</span>
              </button>
            </form>
          )}

        </div>
      )}

      {/* ==================================================== */}
      {/* STEP 2: EXAM RULES & START SCREEN / STAGE TRANSITION */}
      {/* ==================================================== */}
      {user && !isExamRunning && currentAttempt?.status === 'in_progress' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md p-6 sm:p-10 space-y-8 animate-fadeIn">
          
          {/* Active Test Stage Guidance */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-full">
                  Stage {activeTestIndex} of 3
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Examination in Progress
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                {getTestTitle(activeTestIndex)}
              </h3>
            </div>

            <button
              onClick={() => startActiveTest(activeTestIndex)}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              <span>Begin Test {activeTestIndex} Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Previous Completed Test Summaries */}
          {currentAttempt.scores.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Completed Test Tiers:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentAttempt.scores.map((score, idx) => (
                  <div key={idx} className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center shrink-0">
                        <Check className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900 dark:text-slate-100">{score.testName}</div>
                        <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold">
                          {score.netWpm} WPM &bull; {score.accuracy}% Accuracy
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3 Sequential Tests Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className={`p-5 rounded-2xl border space-y-2 transition-all ${
              activeTestIndex === 1 ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 ring-2 ring-amber-500/30' : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 opacity-75'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">Test 1</span>
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">Zigzag Single Characters</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Non-continuous Devanagari character matrix (क ज्ञ १ ठ थ ५ ऋ ॐ ढ...) testing shift keys and raw agility.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border space-y-2 transition-all ${
              activeTestIndex === 2 ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 ring-2 ring-amber-500/30' : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 opacity-75'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-800 dark:text-indigo-300">Test 2</span>
                <Zap className="w-4 h-4 text-indigo-600" />
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">50 Random Words</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Randomized 50 Devanagari word sequence (संविधान, सर्वोच्च अदालत, प्रशासन, फैसला, साक्षी...).
              </p>
            </div>

            <div className={`p-5 rounded-2xl border space-y-2 transition-all ${
              activeTestIndex === 3 ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 ring-2 ring-amber-500/30' : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 opacity-75'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-blue-800 dark:text-blue-300">Test 3</span>
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">150-Word Legal Paragraph</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Official 150-word administrative passage covering constitutional law, judiciary, and governance.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* Fresh start exam screen if no current attempt active */}
      {user && !isExamRunning && !currentAttempt && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md p-6 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-amber-500" />
                <span>Examination Structure & Security Directives</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Candidate: <strong>{user.fullName}</strong> &bull; ID: <strong>{user.idType} ({user.idNumber})</strong>
              </p>
            </div>

            <button
              onClick={handleStartExam}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              <span>Start Certification Exam Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* STEP 3: LIVE EXAM TYPING RUNNER                      */}
      {/* ==================================================== */}
      {isExamRunning && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-amber-500 dark:border-amber-500 shadow-2xl p-6 sm:p-10 space-y-6 animate-fadeIn">
          
          {/* Violation Warning Banner */}
          {showViolationWarning && (
            <div className="p-4 bg-rose-500 text-white rounded-2xl flex items-center justify-between font-extrabold text-xs animate-pulse">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span>SECURITY WARNING: Tab switch / focus loss detected ({tabSwitchViolations}/3). Excessive violations will invalidate this attempt!</span>
              </div>
              <button onClick={() => setShowViolationWarning(false)} className="underline cursor-pointer">Dismiss</button>
            </div>
          )}

          {/* Test Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-full">
                  Stage {activeTestIndex} of 3
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  NTPC Official Examination
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
                {getTestTitle(activeTestIndex)}
              </h3>
            </div>

            <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Elapsed</div>
                <div className="text-lg font-black text-blue-600 dark:text-blue-400">{elapsedSeconds}s</div>
              </div>
              <div className="w-px h-8 bg-slate-300 dark:bg-slate-700"></div>
              <div className="text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Backspaces</div>
                <div className="text-lg font-black text-rose-600">{backspaceCount}</div>
              </div>
            </div>
          </div>

          {/* Target Text Prompt Display */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 leading-relaxed font-semibold text-base sm:text-xl text-slate-800 dark:text-slate-200 tracking-wide font-['Noto_Sans_Devanagari',sans-serif] select-none pointer-events-none max-h-64 overflow-y-auto">
            {getTargetTextForTest(activeTestIndex)}
          </div>

          {/* Interactive Typing Input Box */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-300">
              Type Romanized Nepali (e.g. "nepalko sambidhan" &rarr; "नेपालको संविधान"):
            </label>
            <textarea
              ref={inputRef}
              value={typedInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDownProtection}
              onCopy={e => e.preventDefault()}
              onPaste={e => e.preventDefault()}
              onCut={e => e.preventDefault()}
              onContextMenu={e => e.preventDefault()}
              rows={4}
              placeholder="Begin typing here... Copy/Paste is disabled."
              className="w-full p-4 rounded-2xl border-2 border-amber-500/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-lg sm:text-xl font-bold focus:outline-none focus:ring-4 focus:ring-amber-500/30 leading-relaxed font-['Noto_Sans_Devanagari',sans-serif]"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-2">
            <span>Progress: {typedInput.length} / {getTargetTextForTest(activeTestIndex).length} characters</span>
            <button
              onClick={() => completeCurrentTest(typedInput)}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
            >
              Submit Stage {activeTestIndex}
            </button>
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* STEP 4: PENDING CREATOR VERIFICATION SCREEN           */}
      {/* ==================================================== */}
      {currentAttempt?.status === 'pending_verification' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-amber-500 p-8 sm:p-10 shadow-2xl space-y-8 animate-fadeIn">
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/40">
              <Clock className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Examination Submitted – Pending Creator Verification
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-semibold">
              Examinee <strong>{currentAttempt.user.fullName}</strong> has successfully submitted all 3 test stages. To lock and issue the official NTPC Certificate, the examination creator must verify the submitted identity information.
            </p>
          </div>

          {/* Scores Overview Table */}
          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Submitted Test Tier Performance Summary:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {currentAttempt.scores.map((score, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">{score.testName}</div>
                  <div className="text-xl font-black text-slate-900 dark:text-slate-100">{score.netWpm} WPM</div>
                  <div className="text-xs font-extrabold text-emerald-600">{score.accuracy}% Accuracy</div>
                </div>
              ))}
            </div>
          </div>

          {/* CREATOR VERIFICATION CONTROL PORTAL */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-slate-100 p-6 sm:p-8 rounded-2xl border-2 border-amber-500 shadow-xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <h4 className="text-base font-black text-amber-400">
                  Creator / Examiner Verification Portal (सिर्जनाकर्ता प्रमाणीकरण)
                </h4>
                <p className="text-xs text-slate-400">
                  Click below as Creator/Examiner to verify information and generate the official certificate.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div><strong>Candidate Name:</strong> {currentAttempt.user.fullName}</div>
              <div><strong>Government ID:</strong> {currentAttempt.user.idType} ({currentAttempt.user.idNumber})</div>
              <div><strong>Location:</strong> {currentAttempt.user.district}, {currentAttempt.user.province}</div>
              <div><strong>Overall Average WPM:</strong> {currentAttempt.avgNetWpm} WPM ({currentAttempt.avgAccuracy}% Accuracy)</div>
            </div>

            <button
              onClick={handleCreatorApproveAndVerify}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black text-sm shadow-xl hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5 text-slate-950" />
              <span>Verify & Issue Official NTPC Certificate (प्रमाणित गरी प्रमाणपत्र जारी गर्नुहोस्)</span>
            </button>
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* STEP 5: AUTOMATIC TWO-PAGE OFFICIAL CERTIFICATE     */}
      {/* ==================================================== */}
      {(currentAttempt?.status === 'completed' || showCertificateModal) && currentAttempt && (
        <div className="space-y-6 animate-fadeIn">
          <OfficialCertificateDocument
            attempt={currentAttempt}
            onClose={() => setShowCertificateModal(false)}
          />
        </div>
      )}


    </div>
  );
};
