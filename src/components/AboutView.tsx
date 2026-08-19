import React from 'react';
import {
  User,
  Award,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Mail,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  ExternalLink,
  Linkedin,
  FileCheck2,
  Bookmark,
  Gavel,
  Scroll,
  Layers,
  ChevronRight,
  Zap,
  Keyboard,
  FileText,
  Milestone,
  HeartHandshake
} from 'lucide-react';

import { ArrowLeft } from 'lucide-react';

interface AboutViewProps {
  onNavigateTab?: (tab: any) => void;
  onBack?: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigateTab, onBack }) => {
  const stats = [
    { value: '5+', label: 'Years of Academic Excellence', icon: GraduationCap, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    { value: 'Top 10', label: 'Nepal Bar Council License Exam Rank', icon: Award, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
    { value: 'Licensed', label: 'Advocate, Nepal Bar Council', icon: Scale, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { value: 'LL.M.', label: 'Nepal Law Campus (Ongoing)', icon: BookOpen, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
  ];

  const skills = [
    'Criminal Law',
    'Constitutional Law',
    'Civil Law',
    'Legal Research',
    'Legal Drafting',
    'Case Analysis',
    'Juvenile Justice',
    'Legislative Research',
    'Constitutional Interpretation',
    'Court Procedure',
    'Investigation Report Analysis',
    'Legal Writing',
    'Advocacy',
    'Rule of Law'
  ];

  const areasOfInterest = [
    'Criminal Law',
    'Constitutional Law',
    'Juvenile Justice',
    'Legislative Procedures',
    'Rule of Law',
    'Legal Research'
  ];

  const achievements = [
    'Top 10 Rank in the 33rd Nepal Bar Council Advocate License Examination',
    'Licensed Advocate under Nepal Bar Council',
    'BALLB Graduate (Bright Vision Law College, Purbanchal University)',
    'LL.M. Scholar (Nepal Law Campus, Tribhuvan University)'
  ];

  const internResponsibilities = [
    'Assisting public prosecutors',
    'Conducting legal research',
    'Reviewing investigation reports',
    'Drafting legal documents',
    'Supporting criminal case preparation'
  ];

  return (
    <div id="about-section" className="w-full max-w-6xl mx-auto space-y-10 animate-fadeIn pb-12 select-none">
      
      {/* Hero Profile Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
          
          <div className="space-y-4 text-center lg:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              {onBack && (
                <button
                  onClick={onBack}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition-all cursor-pointer border border-white/20"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>← Back to Typing Engine</span>
                </button>
              )}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-extrabold text-xs tracking-wider uppercase">
                <Scale className="w-4 h-4 text-amber-400" />
                <span>Creator Profile & Legal Background</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Adv. Subhash Lamichhane
            </h1>

            <p className="text-amber-300 font-extrabold text-base sm:text-lg tracking-wide">
              "Advocating for Justice, Committed to Academic Excellence."
            </p>

            <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed max-w-2xl">
              Advocate, Nepal Bar Council &bull; Legal Researcher &bull; Creator of <strong className="text-white">Nepali Typing Pro</strong>
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2 text-xs font-bold text-slate-300">
              <span className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-amber-300 flex items-center gap-1.5">
                <Gavel className="w-3.5 h-3.5 text-amber-400" />
                Licensed Advocate
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-blue-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                Legal Researcher
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-emerald-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                Top 10 Rank Advocate
              </span>
            </div>
          </div>

          {/* Connect & Avatar Box */}
          <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 text-center w-full lg:w-80 shrink-0 shadow-2xl space-y-5">
            <div className="relative inline-block">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black text-3xl sm:text-4xl flex items-center justify-center mx-auto shadow-xl border-2 border-white/40">
                SL
              </div>
              <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-md border border-white/30">
                <Scale className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                Adv. Subhash Lamichhane
              </h2>
              <p className="text-amber-300 font-bold text-xs mt-1">
                Advocate & Legal Researcher
              </p>
            </div>

            {/* Direct Connect Buttons */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <a
                href="https://subhashlamichhane.com.np/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                <Globe className="w-4 h-4" />
                <span>Visit Official Website</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              <a
                href="https://www.linkedin.com/in/subhash-lamichhane/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                <Linkedin className="w-4 h-4" />
                <span>Connect on LinkedIn</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              <a
                href="mailto:lcsubhash1@gmail.com"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all cursor-pointer border border-white/20"
              >
                <Mail className="w-4 h-4 text-rose-300" />
                <span>lcsubhash1@gmail.com</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Modern Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
              <div className={`p-4 rounded-2xl border ${stat.color} shrink-0`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Creator Biography Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md p-6 sm:p-10 space-y-6">
        
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              About the Creator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Adv. Subhash Lamichhane
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          <p>
            <strong className="text-slate-900 dark:text-slate-100 font-bold">Adv. Subhash Lamichhane</strong> is a licensed Advocate under the Nepal Bar Council, holding a Bachelor of Arts, Bachelor of Laws (BALLB) degree from Bright Vision Law College under Purbanchal University. He is currently pursuing an LL.M. at Nepal Law Campus, Tribhuvan University.
          </p>
          <p>
            He secured a <strong className="text-amber-600 dark:text-amber-400 font-extrabold">Top 10 Rank in the 33rd Nepal Bar Council Advocate License Examination</strong>, reflecting his dedication to legal excellence and academic achievement.
          </p>
          <p>
            He is currently serving as a <strong className="text-blue-600 dark:text-blue-400 font-extrabold">Legal Intern at the Kathmandu District Attorney's Office</strong>, where he assists prosecutors, conducts legal research, reviews investigation reports, and contributes to criminal justice proceedings.
          </p>

          <div className="pt-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-500" />
              <span>Areas of Interest</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {areasOfInterest.map((interest, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Education & Professional Experience Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Education Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Education
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            
            {/* BALLB */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 dark:text-slate-100 text-sm">BALLB</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-extrabold text-[10px]">Graduated: 2024</span>
              </div>
              <div className="font-bold text-slate-700 dark:text-slate-300">Bright Vision Law College</div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">Purbanchal University &bull; Bachelor of Arts, Bachelor of Laws</div>
            </div>

            {/* LLM */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 dark:text-slate-100 text-sm">LL.M. (Ongoing)</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 font-extrabold text-[10px]">Started: 2026</span>
              </div>
              <div className="font-bold text-slate-700 dark:text-slate-300">Nepal Law Campus</div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">Tribhuvan University &bull; Master of Laws</div>
            </div>

          </div>
        </div>

        {/* Professional Experience Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Professional Experience
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
            <div>
              <div className="font-black text-slate-900 dark:text-slate-100 text-sm">Legal Intern</div>
              <div className="font-bold text-amber-600 dark:text-amber-400">Kathmandu District Attorney's Office</div>
            </div>

            <div>
              <div className="font-extrabold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                Responsibilities Include:
              </div>
              <ul className="space-y-1.5 font-medium text-slate-600 dark:text-slate-400">
                {internResponsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Achievements & Honors */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Achievements & Honors
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
          {achievements.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Skills & Competencies */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
            <Scroll className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Skills & Competencies
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Core legal domains and professional expertise
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-1">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700/70 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              {skill}
            </span>
          ))}
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
              Comprehensive tools engineered for complete Devanagari typing mastery
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

      {/* Future Updates Roadmap */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Milestone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Future Updates Roadmap
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upcoming enhancements scheduled for future platform releases
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-slate-100 font-extrabold block mb-0.5">Multiplayer Speed Racing</strong>
              <span className="text-slate-600 dark:text-slate-400">Compete live against other candidates in real-time Devanagari speed battles.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-slate-100 font-extrabold block mb-0.5">AI Rhythm & Ergonomics</strong>
              <span className="text-slate-600 dark:text-slate-400">Get instant feedback on finger positioning and key release timing.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-slate-100 font-extrabold block mb-0.5">Nepali Dictation Mode (श्रुतिलेख)</strong>
              <span className="text-slate-600 dark:text-slate-400">Practice typing directly from spoken audio clips for court reporting tests.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Connect & Social Section */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl border border-slate-800 p-8 text-white shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h3 className="text-2xl font-black tracking-tight">
              Connect with Adv. Subhash Lamichhane
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm font-medium">
              Official Website, Professional Social Profiles, and Direct Email
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href="https://subhashlamichhane.com.np/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span>Official Website</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <a
              href="https://www.linkedin.com/in/subhash-lamichhane/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn Profile</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <a
              href="mailto:lcsubhash1@gmail.com"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-rose-400" />
              <span>lcsubhash1@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};
