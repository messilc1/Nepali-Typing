import React from 'react';
import {
  User,
  Award,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Sparkles,
  BookOpen,
  Zap,
  Mail,
  MapPin,
  Globe,
  FileText,
  Milestone,
  Keyboard,
  ExternalLink,
  Briefcase,
  GraduationCap,
  HeartHandshake
} from 'lucide-react';

interface AboutViewProps {
  onNavigateTab?: (tab: any) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigateTab }) => {
  return (
    <div id="about-section" className="w-full max-w-6xl mx-auto space-y-10 animate-fadeIn pb-12 select-none">
      
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-slate-700/50">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-extrabold text-xs tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Official Creator Profile & System Overview</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Nepali Typing Pro
            </h1>

            <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
              A state-of-the-art Nepali Devanagari Unicode typing, speed evaluation, and certification platform. Meticulously designed for candidates, legal practitioners, government officials, and students across Nepal.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2 text-xs font-bold text-slate-300">
              <span className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-amber-300">
                Version 2.5.0 (2026 Edition)
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-emerald-300">
                100% Client-Side Fast & Secure
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-blue-300">
                Lok Sewa Standardized
              </span>
            </div>
          </div>

          {/* Profile Card Summary */}
          <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 text-center w-full md:w-80 shrink-0 shadow-xl space-y-4">
            <div className="relative inline-block">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-3xl sm:text-4xl flex items-center justify-center mx-auto shadow-lg border-2 border-white/40">
                SL
              </div>
              <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-md">
                <Scale className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Adv. Subhash Lamichhane
              </h2>
              <p className="text-amber-300 font-extrabold text-xs uppercase tracking-wider mt-0.5">
                Legal Practitioner & Software Architect
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 text-xs text-slate-300 space-y-1.5 font-medium">
              <div className="flex items-center justify-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                <span>Advocate, Nepal Bar Association</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Kathmandu, Nepal</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Creator Profile Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md p-6 sm:p-10 space-y-6">
        
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              About the Creator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Meet the visionary behind Nepal's advanced Devanagari typing platform
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          <div className="md:col-span-2 space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            <p>
              <strong className="text-slate-900 dark:text-slate-100 font-bold">Advocate Subhash Lamichhane</strong> is a legal professional and technology advocate based in Kathmandu, Nepal. Recognizing the persistent challenges faced by law practitioners, judicial officers, Lok Sewa candidates, and civil service examinees during Devanagari Unicode typing tests, he built <strong className="text-blue-600 dark:text-blue-400">Nepali Typing Pro</strong> to bridge the gap between traditional typing and modern digital efficiency.
            </p>
            <p>
              Having worked extensively with court pleadings, constitutional texts, and official government correspondence, Adv. Lamichhane incorporated real-world legal phrases, Lok Sewa syllabus structures, and authentic administrative vocabulary directly into the application's practice models.
            </p>
            <p>
              His mission is to empower every student, job applicant, and professional in Nepal with accurate, standardized, and accessible tools to achieve high typing speeds with perfect Devanagari accuracy.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-500" />
              <span>Key Credentials & Vision</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="font-extrabold text-slate-800 dark:text-slate-200">Legal Practice</div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Specialized in Constitutional, Commercial, and Administrative Law in Nepal.</div>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="font-extrabold text-slate-800 dark:text-slate-200">Unicode Standardization</div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Pioneered instant Romanized-to-Devanagari transliteration logic with full matra precision.</div>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="font-extrabold text-slate-800 dark:text-slate-200">Public Empowerment</div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Committed to keeping the core typing assessment tools completely free for all Nepali citizens.</div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Platform Features Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md p-6 sm:p-10 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-500" />
              <span>Platform Core Features</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comprehensive tools engineered for complete typing mastery
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          
          <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Keyboard className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
              Real-Time Romanized Unicode
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Instant transliteration from standard QWERTY keys to official Devanagari characters (e.g. "nepal" &rarr; "नेपाल").
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
              Lok Sewa Legal Pack
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Curated legal passages, Supreme Court terminology, and civil service exam texts designed for government applicants.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
              NTPC Certification Exam
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              3-stage standardized typing exam with anti-cheat monitoring, identity verification, and printable certificates.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
              Targeted Practice Drills
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Practice individual consonants, matra combinations, conjunct characters (संयुक्त अक्षर), numbers, and symbols.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
              Heatmap Analytics
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Visual keyboard highlighting weak keys, error-prone letters, typing consistency percentage, and progress over time.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
              Custom Paragraph Import
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Import custom documents, legal briefs, or personal notes to practice typing custom real-world materials.
            </p>
          </div>

        </div>

      </div>

      {/* Roadmap & Contact Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Roadmap */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            <Milestone className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
              Future Updates Roadmap
            </h3>
          </div>

          <div className="space-y-3 text-xs font-medium">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 dark:text-slate-200">Multiplayer Speed Racing:</strong> Compete live against other candidates in real-time Devanagari speed battles.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 dark:text-slate-200">AI Rhythm & Finger Ergonomics:</strong> Get instant feedback on finger positioning and key release timing.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 dark:text-slate-200">Nepali Dictation Mode (श्रुतिलेख):</strong> Practice typing directly from spoken audio clips for court reporting tests.
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Support */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            <Mail className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
              Direct Contact & Feedback
            </h3>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Have suggestions, legal text additions, or feedback? Feel free to reach out directly to Adv. Subhash Lamichhane.
          </p>

          <div className="space-y-3 pt-1 text-xs">
            <a
              href="mailto:lcsubhash41@gmail.com"
              className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 font-extrabold hover:bg-blue-100 transition-colors"
            >
              <Mail className="w-4 h-4 text-blue-600" />
              <span>lcsubhash41@gmail.com</span>
            </a>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Kathmandu, Nepal</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-bold">
            <span>Nepali Typing Pro &copy; 2026</span>
            <span className="flex items-center gap-1"><HeartHandshake className="w-3.5 h-3.5 text-rose-500" /> Built for Nepal</span>
          </div>
        </div>

      </div>

    </div>
  );
};
