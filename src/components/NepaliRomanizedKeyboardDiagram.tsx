import React, { useState } from 'react';
import { Keyboard, Info, Sparkles, HelpCircle, CheckCircle2, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface KeyDetail {
  engUpper: string;
  engLower: string;
  nepUpper: string;
  nepLower: string;
  width?: string;
  note?: string;
}

export const NepaliRomanizedKeyboardDiagram: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'layout' | 'conjuncts' | 'examples'>('layout');
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedExample(text);
    setTimeout(() => setCopiedExample(null), 2000);
  };

  const row0: KeyDetail[] = [
    { engUpper: '~', engLower: '`', nepUpper: 'ऽ', nepLower: 'ऽ' },
    { engUpper: '!', engLower: '1', nepUpper: '!', nepLower: '१' },
    { engUpper: '@', engLower: '2', nepUpper: '@', nepLower: '२' },
    { engUpper: '#', engLower: '3', nepUpper: '#', nepLower: '३' },
    { engUpper: '$', engLower: '4', nepUpper: '$', nepLower: '४' },
    { engUpper: '%', engLower: '5', nepUpper: '%', nepLower: '५' },
    { engUpper: '^', engLower: '6', nepUpper: '^', nepLower: '६' },
    { engUpper: '&', engLower: '7', nepUpper: '&', nepLower: '७' },
    { engUpper: '*', engLower: '8', nepUpper: '*', nepLower: '८' },
    { engUpper: '(', engLower: '9', nepUpper: '(', nepLower: '९' },
    { engUpper: ')', engLower: '0', nepUpper: ')', nepLower: '०' },
    { engUpper: '_', engLower: '-', nepUpper: '—', nepLower: '-' },
    { engUpper: '+', engLower: '=', nepUpper: 'ZWNJ', nepLower: 'ZWJ' },
    { engUpper: '|', engLower: '\\', nepUpper: 'ॐ', nepLower: 'ः' },
  ];

  const row1: KeyDetail[] = [
    { engUpper: 'Q', engLower: 'q', nepUpper: 'ठ', nepLower: 'ट' },
    { engUpper: 'W', engLower: 'w', nepUpper: 'औ', nepLower: 'ौ' },
    { engUpper: 'E', engLower: 'e', nepUpper: 'ै', nepLower: 'े' },
    { engUpper: 'R', engLower: 'r', nepUpper: 'ृ', nepLower: 'र' },
    { engUpper: 'T', engLower: 't', nepUpper: 'थ', nepLower: 'त' },
    { engUpper: 'Y', engLower: 'y', nepUpper: 'ञ', nepLower: 'य' },
    { engUpper: 'U', engLower: 'u', nepUpper: 'ू', nepLower: 'ु' },
    { engUpper: 'I', engLower: 'i', nepUpper: 'ी', nepLower: 'ि' },
    { engUpper: 'O', engLower: 'o', nepUpper: 'ओ', nepLower: 'ो' },
    { engUpper: 'P', engLower: 'p', nepUpper: 'फ', nepLower: 'प' },
    { engUpper: '{', engLower: '[', nepUpper: 'ई', nepLower: 'इ' },
    { engUpper: '}', engLower: ']', nepUpper: 'ऐ', nepLower: 'ए' },
  ];

  const row2: KeyDetail[] = [
    { engUpper: 'A', engLower: 'a', nepUpper: 'आ', nepLower: 'ा' },
    { engUpper: 'S', engLower: 's', nepUpper: 'श', nepLower: 'स' },
    { engUpper: 'D', engLower: 'd', nepUpper: 'ध', nepLower: 'द' },
    { engUpper: 'F', engLower: 'f', nepUpper: 'ऊ', nepLower: 'उ' },
    { engUpper: 'G', engLower: 'g', nepUpper: 'घ', nepLower: 'ग' },
    { engUpper: 'H', engLower: 'h', nepUpper: 'अ', nepLower: 'ह' },
    { engUpper: 'J', engLower: 'j', nepUpper: 'झ', nepLower: 'ज' },
    { engUpper: 'K', engLower: 'k', nepUpper: 'ख', nepLower: 'क' },
    { engUpper: 'L', engLower: 'l', nepUpper: 'ळ', nepLower: 'ल' },
    { engUpper: ':', engLower: ';', nepUpper: ':', nepLower: ';' },
    { engUpper: '"', engLower: "'", nepUpper: '"', nepLower: "'" },
  ];

  const row3: KeyDetail[] = [
    { engUpper: 'Z', engLower: 'z', nepUpper: 'ऋ', nepLower: 'ष' },
    { engUpper: 'X', engLower: 'x', nepUpper: 'ढ', nepLower: 'ड' },
    { engUpper: 'C', engLower: 'c', nepUpper: 'छ', nepLower: 'च' },
    { engUpper: 'V', engLower: 'v', nepUpper: 'ँ', nepLower: 'व' },
    { engUpper: 'B', engLower: 'b', nepUpper: 'भ', nepLower: 'ब' },
    { engUpper: 'N', engLower: 'n', nepUpper: 'ण', nepLower: 'न' },
    { engUpper: 'M', engLower: 'm', nepUpper: 'ं', nepLower: 'म' },
    { engUpper: '<', engLower: ',', nepUpper: 'ङ', nepLower: ',' },
    { engUpper: '>', engLower: '.', nepUpper: '॥', nepLower: '।' },
    { engUpper: '?', engLower: '/', nepUpper: '?', nepLower: '/' },
  ];

  const conjunctRules = [
    { rule: 'क + ् + ष', result: 'क्ष', keys: 'k + / + z', name: 'Ksha' },
    { rule: 'त + ् + त', result: 'त्त', keys: 't + / + t', name: 'Tta' },
    { rule: 'श + ् + र', result: 'श्र', keys: 'S + / + r', name: 'Shra' },
    { rule: 'त + ् + र', result: 'त्र', keys: 't + / + r', name: 'Tra' },
    { rule: 'द + ् + ध', result: 'द्ध', keys: 'd + / + D', name: 'Dha' },
    { rule: 'द + ् + य', result: 'द्य', keys: 'd + / + y', name: 'Dya' },
    { rule: 'ज + ् + ञ', result: 'ज्ञ', keys: 'j + / + Y', name: 'Gyan' },
    { rule: 'द + ् + व', result: 'द्व', keys: 'd + / + v', name: 'Dwa' },
    { rule: 'ट + ् + ट', result: 'ट्ट', keys: 'q + / + q', name: 'T-ta' },
  ];

  const typingExamples = [
    { target: 'किकर्तव्यविमूढ', sequence: 'k i M k r / t v / y b i m u X', description: 'Complex conjunct test word' },
    { target: 'नेपाल', sequence: 'n e p a l', description: 'Standard country name' },
    { target: 'नेपाली', sequence: 'n e p a l i', description: 'Language name with dirgha I' },
    { target: 'अदालत', sequence: 'a d a l a t', description: 'Court terminology' },
    { target: 'संविधान', sequence: 'm s v i d h a n', description: 'Constitution' },
  ];

  return (
    <div id="nepali-keyboard-layout-diagram" className="w-full bg-slate-900 text-slate-100 rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-800 space-y-6 overflow-hidden">
      
      {/* Diagram Header Banner */}
      <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-black shrink-0">
            <Keyboard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-amber-400 tracking-tight">
              नेपाली युनिकोड किबोर्ड लेआउट (रोमनाइज्ड)
            </h3>
            <p className="text-xs text-slate-300 font-semibold">
              Official Nepali Unicode Keyboard Layout (Romanized Standard)
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl text-xs font-bold border border-slate-800">
          <button
            onClick={() => setActiveTab('layout')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'layout' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Keyboard Map
          </button>
          <button
            onClick={() => setActiveTab('conjuncts')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'conjuncts' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Conjunct Rules (संयुक्त अक्षर)
          </button>
          <button
            onClick={() => setActiveTab('examples')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'examples' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Examples
          </button>
        </div>
      </div>

      {activeTab === 'layout' && (
        <div className="space-y-4">
          
          {/* Main Visual Keyboard Representation */}
          <div className="bg-slate-950 p-3 sm:p-5 rounded-2xl border border-slate-800 shadow-inner overflow-x-auto no-scrollbar">
            <div className="min-w-[700px] space-y-2 select-none">
              
              {/* Row 0: Numbers & Symbols */}
              <div className="flex gap-1.5">
                {row0.map((k, idx) => (
                  <div key={idx} className="flex-1 h-14 bg-slate-800 rounded-lg border border-slate-700/80 p-1 flex flex-col justify-between relative hover:border-amber-400 transition-colors">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                      <span>{k.engUpper}</span>
                      <span className="text-amber-300 font-extrabold text-xs">{k.nepUpper}</span>
                    </div>
                    <div className="flex justify-between items-end text-[11px] font-mono text-slate-200">
                      <span className="text-slate-500">{k.engLower}</span>
                      <span className="text-white font-black text-sm">{k.nepLower}</span>
                    </div>
                  </div>
                ))}
                <div className="w-16 h-14 bg-slate-800/80 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 font-mono text-xs font-bold">
                  ← Back
                </div>
              </div>

              {/* Row 1: QWERTY Row */}
              <div className="flex gap-1.5">
                <div className="w-12 h-14 bg-slate-800/80 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 font-mono text-xs font-bold shrink-0">
                  Tab ➔
                </div>
                {row1.map((k, idx) => (
                  <div key={idx} className="flex-1 h-14 bg-slate-800 rounded-lg border border-slate-700/80 p-1 flex flex-col justify-between relative hover:border-amber-400 transition-colors">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                      <span>{k.engUpper}</span>
                      <span className="text-amber-300 font-extrabold text-xs">{k.nepUpper}</span>
                    </div>
                    <div className="flex justify-between items-end text-[11px] font-mono text-slate-200">
                      <span className="text-slate-500">{k.engLower}</span>
                      <span className="text-white font-black text-sm">{k.nepLower}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 2: ASDF Row */}
              <div className="flex gap-1.5">
                <div className="w-14 h-14 bg-slate-800/80 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 font-mono text-xs font-bold shrink-0">
                  Shift ⇧
                </div>
                {row2.map((k, idx) => (
                  <div key={idx} className="flex-1 h-14 bg-slate-800 rounded-lg border border-slate-700/80 p-1 flex flex-col justify-between relative hover:border-amber-400 transition-colors">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                      <span>{k.engUpper}</span>
                      <span className="text-amber-300 font-extrabold text-xs">{k.nepUpper}</span>
                    </div>
                    <div className="flex justify-between items-end text-[11px] font-mono text-slate-200">
                      <span className="text-slate-500">{k.engLower}</span>
                      <span className="text-white font-black text-sm">{k.nepLower}</span>
                    </div>
                  </div>
                ))}
                <div className="w-16 h-14 bg-slate-800/80 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 font-mono text-xs font-bold shrink-0">
                  Enter ↵
                </div>
              </div>

              {/* Row 3: ZXCV Row */}
              <div className="flex gap-1.5">
                <div className="w-20 h-14 bg-slate-800/80 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 font-mono text-xs font-bold shrink-0">
                  Shift ⇧
                </div>
                {row3.map((k, idx) => (
                  <div key={idx} className="flex-1 h-14 bg-slate-800 rounded-lg border border-slate-700/80 p-1 flex flex-col justify-between relative hover:border-amber-400 transition-colors">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                      <span>{k.engUpper}</span>
                      <span className="text-amber-300 font-extrabold text-xs">{k.nepUpper}</span>
                    </div>
                    <div className="flex justify-between items-end text-[11px] font-mono text-slate-200">
                      <span className="text-slate-500">{k.engLower}</span>
                      <span className="text-white font-black text-sm">{k.nepLower}</span>
                    </div>
                  </div>
                ))}
                <div className="w-20 h-14 bg-slate-800/80 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 font-mono text-xs font-bold shrink-0">
                  Shift ⇧
                </div>
              </div>

              {/* Row 4: Spacebar Row */}
              <div className="flex gap-1.5">
                <div className="w-20 h-11 bg-slate-800/80 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 font-mono text-xs font-bold">
                  Ctrl
                </div>
                <div className="w-16 h-11 bg-slate-800/80 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 font-mono text-xs font-bold">
                  Alt
                </div>
                <div className="flex-1 h-11 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 font-mono text-xs font-bold">
                  Spacebar ( खाली ठाउँ )
                </div>
                <div className="w-16 h-11 bg-slate-800/80 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 font-mono text-xs font-bold">
                  Alt
                </div>
                <div className="w-20 h-11 bg-slate-800/80 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 font-mono text-xs font-bold">
                  Ctrl
                </div>
              </div>

            </div>
          </div>

          {/* Key Legend explanation */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono">Q</span>
              <span>Top Left = QWERTY Key</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-amber-500/50 text-amber-300 font-bold">ठ</span>
              <span>Top Right = Shifted Devanagari Character</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-black">ट</span>
              <span>Bottom Right = Normal Devanagari Character</span>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'conjuncts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {conjunctRules.map((c, idx) => (
              <div key={idx} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-medium">
                    {c.rule}
                  </div>
                  <div className="text-xs font-mono text-amber-400 mt-0.5">
                    Keys: <span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-white">{c.keys}</span>
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-400 bg-slate-800 px-3 py-1 rounded-xl border border-slate-700">
                  {c.result}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 font-medium space-y-1">
            <div className="font-extrabold text-amber-300">Special Formatting Codes:</div>
            <div>&bull; <strong>ZWNJ (Zero Width Non-Joiner)</strong>: Created using <kbd className="bg-slate-800 px-1 rounded text-white font-mono">+</kbd> key. Used to keep half characters separate.</div>
            <div>&bull; <strong>ZWJ (Zero Width Joiner)</strong>: Created using <kbd className="bg-slate-800 px-1 rounded text-white font-mono">=</kbd> key. Used for custom conjunct ligatures.</div>
          </div>
        </div>
      )}

      {activeTab === 'examples' && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-400">
            Click to copy Romanized sequence for practice:
          </div>

          {typingExamples.map((ex, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-amber-400">{ex.target}</span>
                  <span className="text-xs text-slate-500 font-medium">({ex.description})</span>
                </div>
                <div className="text-xs font-mono text-slate-300 mt-1">
                  Type sequence: <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-blue-300 font-bold">{ex.sequence}</span>
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(ex.sequence)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors shrink-0 cursor-pointer"
              >
                {copiedExample === ex.sequence ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Keys</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Footer Example Bar matching uploaded image */}
      <div className="pt-3 border-t border-slate-800 text-center text-xs text-slate-300 font-medium">
        <span className="text-amber-400 font-bold">उदाहरण :</span> ' किकर्तव्यविमूढ ' लेख्नुपरेमा <kbd className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-blue-300 font-mono font-bold">k i M k r / t v / y b i m u X</kbd> लहरै दाब्नुपर्नेछ ।
      </div>

    </div>
  );
};
