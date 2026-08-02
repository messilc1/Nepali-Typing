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
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CertificationUser, CertificationAttempt, CertificationTestScore } from '../types';
import { transliterateRomanToNepali } from '../utils/nepaliTransliteration';

// Default Test Passages
const SINGLE_CHAR_TEST_TEXT = "क ख ग घ ङ च छ ज झ ञ ट ठ ड ढ ण त थ द ध न प फ ब भ म ज्ञ क्ष त्र";
const WORD_PHRASE_TEST_TEXT = "संविधान सर्वोच्च अदालत कानुनी व्यवस्था न्यायिक पुनरावलोकन सार्वजनिक प्रशासन महान्यायाधिवक्ता मौलिक अधिकार कार्यपालिका व्यवस्थापिका नेपाल सरकार";
const ADVANCED_PARAGRAPH_TEST_TEXT = "नेपालको संविधान बमोजिम कानुनको शासन, शक्ति पृथकीकरण तथा नियन्त्रण र सन्तुलनको सिद्धान्त अनुरुप स्वतन्त्र, निष्पक्ष र सक्षम न्यायपालिकाको स्थापना गरिएको छ। सर्वोच्च अदालतले संविधान र कानुनको अन्तिम व्याख्या गर्ने अधिकार राख्दछ। सार्वजनिक प्रशासनलाई निष्पक्ष, पारदर्शी, भ्रष्टाचारमुक्त र जनउत्तरदायी बनाउन कानुनी व्यवस्था कडाइका साथ लागू गर्नुपर्दछ।";

export const CertificationView: React.FC = () => {
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
    if (testIdx === 1) return "Test 1: Single Character Speed Examination";
    if (testIdx === 2) return "Test 2: Word & Short Legal Phrase Examination";
    return "Test 3: Advanced Legal Paragraph Examination";
  };

  // Start Certification Exam
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

  // Start Individual Test in Exam
  const startActiveTest = (testIdx: number) => {
    setActiveTestIndex(testIdx);
    setTypedInput('');
    setElapsedSeconds(0);
    setBackspaceCount(0);
    setIsExamRunning(true);
    startTimeRef.current = Date.now();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

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
          // Invalidate attempt
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

  // Key Event Protection (Disable Copy, Paste, Cut, Right Click)
  const handleKeyDownProtection = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Backspace') {
      setBackspaceCount(prev => prev + 1);
    }

    // Disable Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A, Ctrl+Z, Ctrl+Y, F12
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
    if (!isExamRunning) return;
    const rawValue = e.target.value;
    const parsedValue = transliterateRomanToNepali(rawValue);
    setTypedInput(parsedValue);

    const target = getTargetTextForTest(activeTestIndex);

    // Auto complete if finished typing passage
    if (parsedValue.length >= target.length) {
      completeCurrentTest(parsedValue);
    }
  };

  // Calculate Test Score and Complete Test
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

    const updatedScores = [...currentAttempt.scores, testScore];

    if (activeTestIndex < 3) {
      // Proceed to next test
      const nextAttemptState: CertificationAttempt = {
        ...currentAttempt,
        scores: updatedScores
      };
      setCurrentAttempt(nextAttemptState);
      localStorage.setItem('nepali_typing_active_cert_attempt', JSON.stringify(nextAttemptState));
      setActiveTestIndex(prev => prev + 1);
    } else {
      // Final Test 3 Complete -> Calculate Final Evaluation
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

      const finalAttempt: CertificationAttempt = {
        ...currentAttempt,
        scores: updatedScores,
        completedAt: Date.now(),
        status: 'completed',
        avgNetWpm,
        avgGrossWpm,
        avgAccuracy,
        avgConsistency,
        certificateGrade: grade
      };

      setCurrentAttempt(finalAttempt);
      localStorage.setItem('nepali_typing_active_cert_attempt', JSON.stringify(finalAttempt));
      
      // Save to completed certificates history list
      try {
        const historyList = JSON.parse(localStorage.getItem('nepali_typing_cert_history') || '[]');
        historyList.unshift(finalAttempt);
        localStorage.setItem('nepali_typing_cert_history', JSON.stringify(historyList));
      } catch {}

      // Fire celebratory confetti for certificate achievement
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
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
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-950/10 text-slate-950 font-black text-xs rounded-full border border-slate-950/20 w-max mb-3">
              <Award className="w-4 h-4 text-slate-950" />
              <span>National Typing Proficiency Certificate (NTPC)</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950">
              🏆 Official Certification Examination
            </h2>
            <p className="text-slate-900 text-xs sm:text-sm mt-2 max-w-2xl font-semibold leading-relaxed">
              Standardized three-tier examination for Lok Sewa candidates, legal typists, and public service professionals. Earn an official, verifiable proficiency certificate.
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
      {/* STEP 2: EXAM RULES & START SCREEN                    */}
      {/* ==================================================== */}
      {user && !isExamRunning && currentAttempt?.status !== 'in_progress' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md p-6 sm:p-10 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-amber-500" />
                <span>Examination Structure & Security Directives</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Candidate: <strong>{user.fullName}</strong> • ID: <strong>{user.idType} ({user.idNumber})</strong>
              </p>
            </div>

            <button
              onClick={handleStartExam}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-2 shrink-0"
            >
              <span>Start Certification Exam Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* 3 Sequential Tests Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">Test 1</span>
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">Single Characters</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Measures raw key reaction and Devanagari character accuracy across consonants, vowels, and conjuncts.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-800 dark:text-indigo-300">Test 2</span>
                <Zap className="w-4 h-4 text-indigo-600" />
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">Words & Short Phrases</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                High-frequency Lok Sewa legal terms like संविधान, सर्वोच्च अदालत, and सार्वजनिक प्रशासन.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-blue-800 dark:text-blue-300">Test 3</span>
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">Advanced Legal Paragraph</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Challenging administrative passage with complex matra positioning and legal vocabulary.
              </p>
            </div>

          </div>

          {/* Exam Rules & Grading Criteria Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-500" />
                <span>Strict Security Rules</span>
              </h4>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-4 font-medium">
                <li>Exam begins immediately after clicking <strong>Start Certification Exam</strong>.</li>
                <li>Cannot be paused, refreshed, or restarted once initiated.</li>
                <li>Exiting or closing browser invalidates the attempt permanently.</li>
                <li>Copy, paste, cut, text selection, and right-click context menus are strictly disabled.</li>
                <li>Tab-switching or losing window focus is monitored and limited to 2 warnings before automatic invalidation.</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Grading Eligibility Criteria</span>
              </h4>
              <div className="text-xs space-y-2 font-medium">
                <div className="p-2.5 rounded-xl bg-amber-100/60 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                  <strong>🏆 Excellent Certificate:</strong> Average Net WPM &ge; 50 WPM AND Accuracy &ge; 90%.
                </div>
                <div className="p-2.5 rounded-xl bg-blue-100/60 dark:bg-blue-950/50 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                  <strong>🎖️ Good Certificate:</strong> Average Net WPM &ge; 40 WPM AND Accuracy &ge; 90%.
                </div>
                <div className="p-2.5 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 text-slate-800 dark:text-slate-300">
                  <strong>📜 Participation Certificate:</strong> Completed all three tests successfully.
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* STEP 3: LIVE EXAM TYPING RUNNER                      */}
      {/* ==================================================== */}
      {isExamRunning && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-amber-500 dark:border-amber-500 shadow-2xl p-6 sm:p-10 space-y-6">
          
          {/* Violation Banner */}
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
                  Step {activeTestIndex} of 3
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
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 leading-relaxed font-semibold text-lg sm:text-2xl text-slate-800 dark:text-slate-200 tracking-wide font-['Noto_Sans_Devanagari',sans-serif] select-none pointer-events-none">
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
              Submit Test {activeTestIndex} Early
            </button>
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* STEP 4: FINAL EVALUATION & CERTIFICATE GENERATION    */}
      {/* ==================================================== */}
      {currentAttempt?.status === 'completed' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Certificate Result Announcement */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 font-black text-3xl flex items-center justify-center mx-auto shadow-md">
              🏆
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Certification Examination Completed!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-semibold">
              Congratulations <strong>{currentAttempt.user.fullName}</strong>! All three tests have been processed and your official certificate has been locked and recorded.
            </p>

            {/* Score Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-2">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <div className="text-[10px] text-amber-800 dark:text-amber-300 font-bold uppercase">Certificate Grade</div>
                <div className="text-xl font-black text-amber-700 dark:text-amber-400 mt-1">{currentAttempt.certificateGrade}</div>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                <div className="text-[10px] text-blue-800 dark:text-blue-300 font-bold uppercase">Average Net Speed</div>
                <div className="text-xl font-black text-blue-700 dark:text-blue-400 mt-1">{currentAttempt.avgNetWpm} WPM</div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold uppercase">Average Accuracy</div>
                <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-1">{currentAttempt.avgAccuracy}%</div>
              </div>
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                <div className="text-[10px] text-purple-800 dark:text-purple-300 font-bold uppercase">Average Rhythm</div>
                <div className="text-xl font-black text-purple-700 dark:text-purple-400 mt-1">{currentAttempt.avgConsistency}%</div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setShowCertificateModal(true)}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-2"
              >
                <Eye className="w-5 h-5 text-slate-950" />
                <span>View & Print Official Certificate</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-6 py-3.5 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Download PDF</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* CERTIFICATE MODAL / DISPLAY FRAME                    */}
      {/* ==================================================== */}
      {(showCertificateModal || currentAttempt?.status === 'completed') && currentAttempt && (
        <div id="official-certificate-modal" className="bg-white dark:bg-slate-900 rounded-3xl border-4 border-amber-500 p-8 sm:p-12 shadow-2xl relative overflow-hidden space-y-8 print:border-2 print:shadow-none print:p-6 print:m-0">
          
          {/* Certificate Decorative Frame Border */}
          <div className="border-2 border-dashed border-amber-300 dark:border-amber-700 p-6 sm:p-10 rounded-2xl relative space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left border-b border-amber-200 dark:border-amber-800/60 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black text-2xl flex items-center justify-center shrink-0 shadow-md">
                  🇳🇵
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">
                    National Typing Proficiency Certificate
                  </h1>
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider">
                    Nepali Typing Pro • Official Examination Board
                  </p>
                </div>
              </div>

              <div className="text-right text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <div>Certificate ID: <strong className="text-slate-900 dark:text-slate-100 font-mono">{currentAttempt.id}</strong></div>
                <div>Issue Date: <strong>{new Date(currentAttempt.completedAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></div>
              </div>
            </div>

            {/* Certificate Body Text */}
            <div className="text-center space-y-4 py-4">
              <p className="text-xs uppercase font-extrabold text-slate-400 tracking-widest">
                This is to certify that
              </p>
              
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent underline decoration-amber-400 decoration-2 underline-offset-8">
                {currentAttempt.user.fullName}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
                bearing <strong>{currentAttempt.user.idType} ({currentAttempt.user.idNumber})</strong> of <strong>{currentAttempt.user.permanentAddress}, {currentAttempt.user.district}, {currentAttempt.user.province}</strong>, has successfully appeared in the official National Devanagari Typing Examination and demonstrated typing proficiency across three standardized tiers.
              </p>

              {/* Grade Badge */}
              <div className="inline-block px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-lg sm:text-xl shadow-lg my-2">
                🏆 {currentAttempt.certificateGrade?.toUpperCase()} TYPING CERTIFICATE
              </div>
            </div>

            {/* Individual Score Breakdown Table */}
            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="text-xs font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-center">
                Examination Performance Breakdown
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold pt-1">
                {currentAttempt.scores.map((s, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{s.testName}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-extrabold text-blue-600 dark:text-blue-400">{s.netWpm} Net WPM</span>
                      <span className="font-extrabold text-emerald-600">{s.accuracy}% Acc</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer / Signatures / QR Code */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-amber-200 dark:border-amber-800/60 text-xs">
              
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-1 flex items-center justify-center shrink-0">
                  <QrCode className="w-12 h-12 text-slate-800 dark:text-slate-200" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-800 dark:text-slate-200">Scan to Verify Authenticity</div>
                  <div className="text-[10px] text-slate-500 font-mono">nepalitypingpro.gov.np/verify</div>
                  <div className="text-[10px] text-emerald-600 font-extrabold mt-0.5">Status: Verified & Tamper-Proof</div>
                </div>
              </div>

              {/* Official Seal Stamp */}
              <div className="w-20 h-20 rounded-full border-4 border-amber-500 flex items-center justify-center text-center p-1 text-[9px] font-black uppercase text-amber-700 dark:text-amber-400 shrink-0 rotate-12">
                Official Examination Seal
              </div>

              {/* Registrar Signature */}
              <div className="text-center sm:text-right space-y-1">
                <div className="font-serif italic text-lg text-slate-800 dark:text-slate-200">Prof. K. P. Sharma</div>
                <div className="w-36 h-0.5 bg-slate-400 dark:bg-slate-600 ml-auto"></div>
                <div className="font-extrabold text-slate-800 dark:text-slate-200">Chief Examination Registrar</div>
                <div className="text-[10px] text-slate-500">National Typing Examination Board</div>
              </div>

            </div>

          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
            >
              Close Certificate View
            </button>

            <button
              onClick={() => window.print()}
              className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-md cursor-pointer flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Official PDF</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
