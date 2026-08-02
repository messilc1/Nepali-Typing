export interface NepaliFont {
  id: string;
  name: string;
  fontFamilyCss: string;
  category: 'Modern Sans' | 'Traditional Serif' | 'Custom Legal' | 'Windows Classic';
  previewText: string;
  sampleWords: string[];
}

export const SUPPORTED_NEPALI_FONTS: NepaliFont[] = [
  {
    id: 'Kalimati',
    name: 'Kalimati',
    fontFamilyCss: "'Kalimati', 'Noto Sans Devanagari', 'Mukta', sans-serif",
    category: 'Custom Legal',
    previewText: 'नेपालको संविधान २०७२',
    sampleWords: ['संविधान', 'सर्वोच्च अदालत', 'न्यायाधीश']
  },
  {
    id: 'Noto Sans Devanagari',
    name: 'Noto Sans Devanagari',
    fontFamilyCss: "'Noto Sans Devanagari', 'Mukta', sans-serif",
    category: 'Modern Sans',
    previewText: 'नेपाली टाइपिंग गति र दक्षता',
    sampleWords: ['नेपाल', 'टाइपिंग', 'अधिकार']
  },
  {
    id: 'Noto Serif Devanagari',
    name: 'Noto Serif Devanagari',
    fontFamilyCss: "'Noto Serif Devanagari', 'Tiro Devanagari Hindi', serif",
    category: 'Traditional Serif',
    previewText: 'सम्माननीय सर्वोच्च अदालतको आदेश',
    sampleWords: ['सम्माननीय', 'उत्प्रेषण', 'परमादेश']
  },
  {
    id: 'Mukta',
    name: 'Mukta',
    fontFamilyCss: "'Mukta', 'Noto Sans Devanagari', sans-serif",
    category: 'Modern Sans',
    previewText: 'संघीय लोकतान्त्रिक गणतन्त्र नेपाल',
    sampleWords: ['लोकसेवा', 'प्रशासन', 'परीक्षार्थी']
  },
  {
    id: 'Kokila',
    name: 'Kokila',
    fontFamilyCss: "'Kokila', 'Noto Serif Devanagari', serif",
    category: 'Traditional Serif',
    previewText: 'मौलिक हक तथा नागरिक कर्तव्य',
    sampleWords: ['कर्तव्य', 'सार्वभौमसत्ता', 'निवेदन']
  },
  {
    id: 'Mangal',
    name: 'Mangal',
    fontFamilyCss: "'Mangal', 'Noto Sans Devanagari', sans-serif",
    category: 'Windows Classic',
    previewText: 'लोक सेवा आयोग परीक्षा तयारी',
    sampleWords: ['लोकसेवा', 'प्रशासन', 'कानून']
  },
  {
    id: 'Aparajita',
    name: 'Aparajita',
    fontFamilyCss: "'Aparajita', 'Noto Serif Devanagari', serif",
    category: 'Traditional Serif',
    previewText: 'स्वतन्त्र, निष्पक्ष र सक्षम न्यायपालिका',
    sampleWords: ['न्यायपालिका', 'पुनरावेदन', 'फैसला']
  },
  {
    id: 'Tiro Devanagari',
    name: 'Tiro Devanagari',
    fontFamilyCss: "'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif",
    category: 'Custom Legal',
    previewText: 'कानूनी राज्य र मानव अधिकार',
    sampleWords: ['मानव अधिकार', 'बन्देज', 'प्रचलन']
  }
];

export const DEFAULT_NEPALI_FONT = 'Noto Sans Devanagari';

export function getFontCssValue(fontId: string): string {
  const found = SUPPORTED_NEPALI_FONTS.find(f => f.id === fontId);
  return found ? found.fontFamilyCss : SUPPORTED_NEPALI_FONTS[1].fontFamilyCss;
}

export function applyGlobalNepaliFont(fontId: string): void {
  const cssValue = getFontCssValue(fontId);
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--app-nepali-font', cssValue);
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('selectedFont', fontId);
  }
}

export function getStoredNepaliFont(): string {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('selectedFont');
    if (saved && SUPPORTED_NEPALI_FONTS.some(f => f.id === saved)) {
      return saved;
    }
  }
  return DEFAULT_NEPALI_FONT;
}
