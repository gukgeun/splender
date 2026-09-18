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
