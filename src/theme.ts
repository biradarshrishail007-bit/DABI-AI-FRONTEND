/**
 * DABI AI - Centralized Theme Token System
 * Supports complete LIGHT (White + Sky Blue) and DARK (Dark Charcoal + Sky Blue) themes.
 */

export interface ThemeTokens {
  background: string;
  secondaryBg: string;
  sidebar: string;
  card: string;
  primary: string;
  primaryBright: string;
  heading: string;
  foreground: string;
  muted: string;
  accent: string;
  border: string;
  hover: string;
  activeNav: string;
  activeNavText: string;
  success: string;
  btnFrom: string;
  btnTo: string;
  chartGrid: string;
  chartTooltipBg: string;
  chartTooltipBorder: string;
  chartTooltipText: string;
  pieColors: string[];
}

export const LIGHT_THEME: ThemeTokens = {
  background: '#FFFFFF',
  secondaryBg: '#F7FBFF',
  sidebar: '#FFFFFF',
  card: '#FFFFFF',
  primary: '#1EA7F2',
  primaryBright: '#38BDF8',
  heading: '#123B63',
  foreground: '#294B6B',
  muted: '#6B8AA6',
  accent: '#EAF7FF',
  border: '#D7EAF7',
  hover: '#E8F6FF',
  activeNav: '#DDF3FF',
  activeNavText: '#168BD0',
  success: '#20B981',
  btnFrom: '#1EA7F2',
  btnTo: '#38BDF8',
  chartGrid: '#D7EAF7',
  chartTooltipBg: '#FFFFFF',
  chartTooltipBorder: '#D7EAF7',
  chartTooltipText: '#123B63',
  pieColors: ['#1EA7F2', '#38BDF8', '#20B981', '#0EA5E9', '#64748B', '#0284C7', '#7DD3FC']
};

export const DARK_THEME: ThemeTokens = {
  background: '#0B1220',
  secondaryBg: '#101A2B',
  sidebar: '#0A111D',
  card: '#111E30',
  primary: '#38BDF8',
  primaryBright: '#60C8FF',
  heading: '#F8FAFC',
  foreground: '#E2E8F0',
  muted: '#94A3B8',
  accent: '#152438',
  border: '#20334A',
  hover: '#172A40',
  activeNav: '#123B63',
  activeNavText: '#60C8FF',
  success: '#20B981',
  btnFrom: '#38BDF8',
  btnTo: '#1EA7F2',
  chartGrid: '#20334A',
  chartTooltipBg: '#111E30',
  chartTooltipBorder: '#20334A',
  chartTooltipText: '#F8FAFC',
  pieColors: ['#38BDF8', '#60C8FF', '#20B981', '#0EA5E9', '#94A3B8', '#0284C7', '#7DD3FC']
};

export const getThemeTokens = (isDark: boolean): ThemeTokens =>
  isDark ? DARK_THEME : LIGHT_THEME;
