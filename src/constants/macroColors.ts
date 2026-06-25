// ─── Kanonik makro renkleri ──────────────────────────────────────────────────
// Tüm uygulamada protein/karbonhidrat/yağ/lif aynı renklerle gösterilir.
// hex  → SVG stroke / inline style için
// text → Tailwind metin rengi
// bg   → Tailwind dolgu (progress bar) rengi

export interface MacroColor {
  hex: string
  text: string
  bg: string
}

export const MACRO_COLORS: Record<'protein' | 'carbs' | 'fat' | 'fiber', MacroColor> = {
  protein: { hex: '#60a5fa', text: 'text-blue-400',    bg: 'bg-blue-400' },    // mavi
  carbs:   { hex: '#fbbf24', text: 'text-amber-400',   bg: 'bg-amber-400' },   // amber
  fat:     { hex: '#fb7185', text: 'text-rose-400',    bg: 'bg-rose-400' },    // gül
  fiber:   { hex: '#34d399', text: 'text-emerald-400', bg: 'bg-emerald-400' }, // zümrüt
}
