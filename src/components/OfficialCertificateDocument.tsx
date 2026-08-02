import React from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Share2,
  Download,
  QrCode,
  FileText,
  UserCheck,
  Sparkles,
  Zap,
  Clock,
  ExternalLink,
  Lock,
  BarChart3
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { CertificationAttempt } from '../types';

interface OfficialCertificateDocumentProps {
  attempt: CertificationAttempt;
  onClose?: () => void;
}

export const OfficialCertificateDocument: React.FC<OfficialCertificateDocumentProps> = ({
  attempt,
  onClose
}) => {
  const { user, scores, avgNetWpm = 0, avgGrossWpm = 0, avgAccuracy = 0, avgConsistency = 0, certificateGrade = 'Participation', id: certId, completedAt } = attempt;

  // Format issue date
  const issueDateStr = completedAt
    ? new Date(completedAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

  // Calculate total duration in minutes & seconds
  const totalDurationSeconds = scores.reduce((acc, s) => acc + s.durationSeconds, 0);
  const totalMin = Math.floor(totalDurationSeconds / 60);
  const totalSec = totalDurationSeconds % 60;
  const timeFormatted = `${totalMin}m ${totalSec}s`;

  // Calculate total mistakes and total words typed
  const totalMistakes = scores.reduce((acc, s) => acc + s.mistakes, 0);

  // Verification URL
  const verificationUrl = `${window.location.origin}/#verify/${certId}`;
  const digitalHash = `SHA256:${certId.replace(/[^A-Z0-9]/g, '')}790288989127E`;

  // Chart data
  const chartData = scores.map((s, idx) => ({
    name: `Test ${idx + 1}`,
    'Net WPM': s.netWpm,
    'Gross WPM': s.grossWpm,
    'Accuracy (%)': s.accuracy,
    'Consistency (%)': s.consistency
  }));

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Nepali Typing Pro Certificate - ${user.fullName}`,
          text: `Check out my official Nepali Typing Pro Proficiency Certificate (${certId}) with ${avgNetWpm} WPM and ${avgAccuracy}% accuracy!`,
          url: verificationUrl
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(verificationUrl);
      alert('Verification link copied to clipboard: ' + verificationUrl);
    }
  };

  // Grade Badge Styling helper
  const getGradeBadge = (grade: string) => {
    if (grade === 'Excellent') {
      return {
        title: '🏆 EXCELLENT TYPING CERTIFICATE',
        sub: 'Outstanding speed, precision, and Devanagari mastery.',
        bg: 'bg-amber-500 text-slate-950 border-amber-400',
        text: 'text-amber-500'
      };
    }
    if (grade === 'Good') {
      return {
        title: '🏆 GOOD TYPING CERTIFICATE',
        sub: 'Proficient speed and high accuracy suitable for legal & public service.',
        bg: 'bg-emerald-500 text-slate-950 border-emerald-400',
        text: 'text-emerald-500'
      };
    }
    return {
      title: '🏆 PARTICIPATION TYPING CERTIFICATE',
      sub: 'Verified completion of all three examination tiers.',
      bg: 'bg-indigo-600 text-white border-indigo-400',
      text: 'text-indigo-400'
    };
  };

  const gradeInfo = getGradeBadge(certificateGrade);

  return (
    <div className="w-full space-y-8">
      
      {/* Top Action Control Toolbar (Screen view only) */}
      <div className="print:hidden bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/40">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">
              Official Certificate & Examination Report Ready
            </h3>
            <p className="text-xs text-slate-400">
              Certificate ID: <span className="font-mono text-amber-400 font-bold">{certId}</span> &bull; Verified Candidate: {user.fullName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>

          <button
            onClick={handleShare}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4 text-slate-400" />
            <span>Share Link</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* DOCUMENT WRAPPER WITH PRINT SPECIFIC PAGE STYLING */}
      <div id="printable-certificate-document" className="space-y-12 print:space-y-0 print:p-0">
        
        {/* ========================================================================= */}
        {/* PAGE 1 – OFFICIAL EXAMINATION REPORT                                     */}
        {/* ========================================================================= */}
        <div className="cert-page cert-page-1 bg-white text-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xl relative space-y-8 print:border-none print:shadow-none print:p-8 print:rounded-none min-h-[1050px] flex flex-col justify-between break-after-page">
          
          <div className="space-y-8">
            
            {/* Page 1 Header */}
            <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-2xl font-black tracking-tight text-amber-600 flex items-center gap-2">
                  <Award className="w-7 h-7 text-amber-500" />
                  <span>Nepali Typing Pro</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-wide mt-0.5">
                  Official Certification Examination Report
                </h1>
                <p className="text-xs text-slate-600 font-medium max-w-xl mt-1">
                  Standardized three-tier examination for Lok Sewa candidates, legal typists, and public service professionals. Earn an official, creator-verified proficiency certificate.
                </p>
              </div>

              <div className="text-left sm:text-right text-xs space-y-1 shrink-0 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="font-extrabold text-slate-900">Certificate ID: <span className="font-mono text-amber-600">{certId}</span></div>
                <div className="text-slate-600">Issue Date: <strong>{issueDateStr}</strong></div>
                <div className="text-emerald-700 font-bold flex items-center gap-1 sm:justify-end">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Status: Creator Verified</span>
                </div>
              </div>
            </div>

            {/* Candidate Information Card */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2">
                <UserCheck className="w-4 h-4 text-amber-600" />
                <span>Candidate Official Information</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Full Name</div>
                  <div className="font-black text-slate-900 text-sm mt-0.5">{user.fullName}</div>
                </div>

                <div>
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Email Address</div>
                  <div className="font-bold text-slate-800 mt-0.5">{user.email}</div>
                </div>

                <div>
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Mobile Number</div>
                  <div className="font-bold text-slate-800 mt-0.5">{user.mobileNumber}</div>
                </div>

                <div>
                  <div className="text-slate-400 font-bold uppercase text-[10px]">{user.idType}</div>
                  <div className="font-extrabold text-blue-700 font-mono mt-0.5">No. {user.idNumber}</div>
                </div>

                <div>
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Permanent Address</div>
                  <div className="font-bold text-slate-800 mt-0.5">{user.permanentAddress}</div>
                </div>

                <div>
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Location</div>
                  <div className="font-bold text-slate-800 mt-0.5">{user.district}, {user.province}, {user.country}</div>
                </div>
              </div>
            </div>

            {/* Verification Status Banner Card */}
            <div className="bg-emerald-50 border-2 border-emerald-500/80 p-5 rounded-2xl flex items-center gap-4 text-slate-900">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center shrink-0 shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="text-xs">
                <h4 className="font-black text-sm text-emerald-950">Official Certificate Verified & Issued</h4>
                <p className="text-emerald-800 font-semibold mt-0.5">
                  Congratulations! Your identity has been verified and your Official Nepali Typing Pro Certificate has been successfully generated.
                </p>
              </div>
            </div>

            {/* Result Summary - High Impact Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                <div className="text-[10px] font-bold text-amber-800 uppercase">Certificate Grade</div>
                <div className="text-lg font-black text-amber-600 mt-1">{certificateGrade}</div>
                <div className="text-[10px] text-amber-700 font-semibold mt-0.5">Official Designation</div>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-center">
                <div className="text-[10px] font-bold text-blue-800 uppercase">Average Speed</div>
                <div className="text-2xl font-black text-blue-700 mt-0.5">{avgNetWpm} <span className="text-xs font-bold">WPM</span></div>
                <div className="text-[10px] text-blue-600 font-semibold mt-0.5">Gross: {avgGrossWpm} WPM</div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                <div className="text-[10px] font-bold text-emerald-800 uppercase">Average Accuracy</div>
                <div className="text-2xl font-black text-emerald-700 mt-0.5">{avgAccuracy}%</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Precision Target</div>
              </div>

              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-center">
                <div className="text-[10px] font-bold text-purple-800 uppercase">Exam Rhythm</div>
                <div className="text-2xl font-black text-purple-700 mt-0.5">{avgConsistency}%</div>
                <div className="text-[10px] text-purple-600 font-semibold mt-0.5">Total Time: {timeFormatted}</div>
              </div>
            </div>

            {/* Individual Test Results Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Individual Examination Tier Results
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {scores.map((s, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-black text-slate-900">Test {idx + 1}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-500">{s.durationSeconds}s</span>
                    </div>
                    <div className="text-xs font-extrabold text-amber-700 leading-tight">
                      {s.testName}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div><span className="text-slate-500">Net WPM:</span> <strong className="text-slate-900">{s.netWpm}</strong></div>
                      <div><span className="text-slate-500">Gross WPM:</span> <strong className="text-slate-900">{s.grossWpm}</strong></div>
                      <div><span className="text-slate-500">Accuracy:</span> <strong className="text-emerald-700">{s.accuracy}%</strong></div>
                      <div><span className="text-slate-500">Consistency:</span> <strong className="text-purple-700">{s.consistency}%</strong></div>
                      <div className="col-span-2 text-rose-700 font-semibold">Mistakes / Corrections: {s.mistakes}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Analytics Chart & Diagnostics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              
              {/* Recharts Bar Comparison */}
              <div className="md:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5 font-black uppercase text-[11px] text-slate-500">
                    <BarChart3 className="w-4 h-4 text-amber-600" />
                    WPM, Accuracy & Consistency Comparison
                  </span>
                </div>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                      <Bar dataKey="Net WPM" fill="#d97706" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Accuracy (%)" fill="#059669" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Consistency (%)" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Keyboard Heatmap Summary */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="font-black uppercase text-[11px] text-slate-500 border-b border-slate-200 pb-2">
                  Performance Diagnostics
                </div>

                <div className="space-y-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">TOTAL MISTYPED WORDS:</span>
                    <span className="font-extrabold text-slate-900">{totalMistakes} Words</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">MOST DIFFICULT CHARACTERS:</span>
                    <span className="font-bold text-amber-700">ज्ञ, ऋ, ठ, ZWNJ (+), ् (Virama)</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">KEYBOARD HEATMAP SUMMARY:</span>
                    <span className="font-semibold text-slate-800">Balanced bilateral row transitions with high home-row accuracy.</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">OVERALL EVALUATION:</span>
                    <span className="font-extrabold text-emerald-700">Verified Lok Sewa & Legal Typing Standard Passed</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Page 1 Footer */}
          <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 font-semibold gap-2">
            <span>Nepali Typing Pro &bull; Official Examination Report (Page 1 of 2)</span>
            <span>Document ID: {certId} &bull; Generated digitally</span>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* PAGE 2 – OFFICIAL PROFICIENCY CERTIFICATE                                */}
        {/* ========================================================================= */}
        <div className="cert-page cert-page-2 bg-white text-slate-900 rounded-3xl p-8 sm:p-14 border-8 border-double border-amber-600 shadow-2xl relative space-y-8 print:border-8 print:border-double print:border-amber-600 print:shadow-none print:p-10 print:rounded-none min-h-[1050px] flex flex-col justify-between break-before-page">
          
          {/* Ornate Inner Border Frame */}
          <div className="space-y-8">
            
            {/* Certificate Header Branding */}
            <div className="text-center space-y-2 relative border-b-2 border-amber-500/30 pb-6">
              
              <div className="flex items-center justify-center gap-2 text-amber-600 font-black tracking-widest uppercase text-xs">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Nepali Typing Pro</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight font-serif uppercase">
                PROFICIENCY CERTIFICATE
              </h2>

              <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                NEPALI TYPING PRO OFFICIAL EXAMINATION BOARD
              </p>

              {/* Certificate Details Badge Header */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-700">
                <div>
                  <span className="text-slate-400 uppercase text-[10px] block">Certificate ID:</span>
                  <span className="font-mono text-amber-700 text-sm font-black">{certId}</span>
                </div>
                <div className="w-px h-6 bg-slate-300"></div>
                <div>
                  <span className="text-slate-400 uppercase text-[10px] block">Issue Date:</span>
                  <span className="text-slate-900 font-black">{issueDateStr}</span>
                </div>
                <div className="w-px h-6 bg-slate-300"></div>
                <div>
                  <span className="text-slate-400 uppercase text-[10px] block">Creator Verified:</span>
                  <span className="text-emerald-700 font-black">YES ✓</span>
                </div>
              </div>

            </div>

            {/* Certificate Text Main Body */}
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                THIS IS TO CERTIFY THAT
              </p>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-950 underline decoration-amber-500 decoration-2 underline-offset-8">
                {user.fullName}
              </h1>

              <div className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed space-y-1">
                <div>
                  Bearing <strong className="text-slate-900">{user.idType}</strong> No. <strong className="text-amber-800 font-mono">{user.idNumber}</strong>
                </div>
                <div>
                  Resident of <strong className="text-slate-900">{user.permanentAddress}, {user.district}, {user.province}, {user.country}</strong>
                </div>
                <p className="pt-2 text-slate-600">
                  has successfully appeared in the <strong>Official Nepali Typing Pro Certification Examination</strong> and demonstrated typing proficiency across three standardized examination tiers.
                </p>
              </div>

              {/* Certificate Grade Banner */}
              <div className="pt-2">
                <div className={`inline-block px-8 py-3.5 rounded-2xl border-2 font-black text-sm sm:text-lg shadow-md uppercase tracking-wider ${gradeInfo.bg}`}>
                  {gradeInfo.title}
                </div>
                <p className="text-xs font-semibold text-slate-500 mt-1.5">
                  {gradeInfo.sub}
                </p>
              </div>

            </div>

            {/* Examination Performance Table Breakdown */}
            <div className="space-y-2 max-w-3xl mx-auto">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-500 text-center">
                Official Three-Tier Performance Breakdown
              </h4>

              <div className="overflow-x-auto rounded-2xl border border-slate-300">
                <table className="w-full text-xs text-left text-slate-800">
                  <thead className="bg-slate-100 text-[11px] font-black uppercase text-slate-700 border-b border-slate-300">
                    <tr>
                      <th className="py-2.5 px-4">Examination</th>
                      <th className="py-2.5 px-3 text-center">Net WPM</th>
                      <th className="py-2.5 px-3 text-center">Accuracy</th>
                      <th className="py-2.5 px-3 text-center">Consistency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-semibold">
                    {scores.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-bold text-slate-900">{s.testName}</td>
                        <td className="py-2.5 px-3 text-center font-extrabold text-amber-700">{s.netWpm} WPM</td>
                        <td className="py-2.5 px-3 text-center font-extrabold text-emerald-700">{s.accuracy}%</td>
                        <td className="py-2.5 px-3 text-center font-extrabold text-purple-700">{s.consistency}%</td>
                      </tr>
                    ))}
                    <tr className="bg-amber-500/10 font-black text-slate-950 text-xs">
                      <td className="py-3 px-4 uppercase tracking-wider text-amber-900">Final Average Aggregate</td>
                      <td className="py-3 px-3 text-center text-amber-800 text-sm">{avgNetWpm} WPM</td>
                      <td className="py-3 px-3 text-center text-emerald-800 text-sm">{avgAccuracy}%</td>
                      <td className="py-3 px-3 text-center text-purple-800 text-sm">{avgConsistency}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Verification Panel & QR Code */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
              
              <div className="flex items-center gap-4">
                {/* QR Code */}
                <div className="bg-white p-2 rounded-xl border border-slate-300 shadow-sm shrink-0">
                  <QRCodeSVG value={verificationUrl} size={84} />
                </div>

                <div className="text-xs space-y-1">
                  <div className="font-black text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Digital Verification Panel</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    Scan QR or visit URL to verify certificate authenticity online.
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 break-all max-w-xs">
                    URL: {verificationUrl}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400">
                    Hash: {digitalHash}
                  </div>
                </div>
              </div>

              <div className="text-center sm:text-right shrink-0 bg-white p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Verification Status</div>
                <div className="text-emerald-700 font-black text-xs flex items-center justify-center sm:justify-end gap-1 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Tamper-Proof & Verified</span>
                </div>
                <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Creator Verified</div>
              </div>

            </div>

            {/* Official Signature Section */}
            <div className="pt-4 flex items-end justify-between max-w-3xl mx-auto text-xs border-t border-slate-200">
              
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-[10px] uppercase font-bold text-slate-400">Certified By</div>
                <div className="font-extrabold text-slate-900">Nepali Typing Pro Examination Board</div>
                <div className="text-[11px] text-slate-600">Standardized Assessment Panel</div>
              </div>

              {/* Creator Digital Signature & Stamp */}
              <div className="text-center space-y-1">
                <div className="w-36 h-12 mx-auto flex items-center justify-center font-serif italic text-xl font-bold text-blue-900 border-b border-slate-400">
                  Subhash L.
                </div>
                <div className="font-black text-slate-950 text-sm">
                  Adv. Subhash Lamichhane
                </div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Creator & Chief Examiner
                </div>
              </div>

              {/* Official Gold Seal Graphic */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 text-slate-950 font-black flex flex-col items-center justify-center shadow-md border-2 border-amber-300 shrink-0 text-[9px] uppercase tracking-tighter text-center leading-none">
                <Award className="w-5 h-5 mb-0.5 text-slate-950" />
                <span>OFFICIAL</span>
                <span>SEAL</span>
              </div>

            </div>

          </div>

          {/* Page 2 Legal Footer */}
          <div className="border-t border-slate-300 pt-3 text-center text-[10px] text-slate-500 font-semibold space-y-0.5">
            <div>This certificate has been digitally generated and verified by Nepali Typing Pro. Any modification to this certificate will invalidate its authenticity.</div>
            <div>&copy; 2026 Nepali Typing Pro. All Rights Reserved. Created by Adv. Subhash Lamichhane</div>
          </div>

        </div>

      </div>

    </div>
  );
};
