import type { TokenColor } from './types';

export interface ColorStyle {
  label: string;
  bg: string;
  fg: string;
  border: string;
}

/** Visual + Korean-label mapping for each gem/token color, shared by every component. */
export const TOKEN_STYLE: Record<TokenColor, ColorStyle> = {
  emerald: { label: '에메랄드', bg: '#15803d', fg: '#ffffff', border: '#0f5c2c' },
  sapphire: { label: '사파이어', bg: '#1d4ed8', fg: '#ffffff', border: '#15379e' },
  ruby: { label: '루비', bg: '#b91c1c', fg: '#ffffff', border: '#8a1515' },
  diamond: { label: '다이아몬드', bg: '#f8fafc', fg: '#1e293b', border: '#cbd5e1' },
  onyx: { label: '오닉스', bg: '#27272a', fg: '#ffffff', border: '#000000' },
  gold: { label: '골드', bg: '#eab308', fg: '#422006', border: '#a16207' },
};

export interface GemGradientStops {
  /** Bright core, offset toward the upper-left so the token reads as lit from one side. */
  highlight: string;
  /** Saturated mid-tone — the color's "true" hue. */
  mid: string;
  /** Dark rim the gradient fades to at the edge. */
  edge: string;
}

/** Radial-gradient stops used to render each token as a glossy glass/gem bead (see TokenChip). */
export const GEM_TOKEN_GRADIENT: Record<TokenColor, GemGradientStops> = {
  emerald: { highlight: '#7fe3ab', mid: '#16a34a', edge: '#0a4a21' },
  sapphire: { highlight: '#93c5fd', mid: '#2563eb', edge: '#122c7a' },
  ruby: { highlight: '#fca5a5', mid: '#dc2626', edge: '#6b0f0f' },
  diamond: { highlight: '#ffffff', mid: '#e2e8f0', edge: '#94a3b8' },
  onyx: { highlight: '#6b7280', mid: '#27272a', edge: '#000000' },
  gold: { highlight: '#fde68a', mid: '#eab308', edge: '#7a4a06' },
};
