export const colors = {
  paper: '#FBF6EF',
  ink: '#2B2925',
  inkMuted: '#8A8378',
  inkFaint: '#C4BCAE',
  border: '#ECE4D6',
  surface: '#FFFFFF',
  overlay: 'rgba(43,41,37,0.50)',

  clay: '#D97B5C',
  clayLight: '#FBE9E0',
  clayDark: '#B85E3E',

  milestone: '#D4A857',
  milestoneL: '#FBF1DC',
  people: '#8A9B7E',
  peopleL: '#EEF2EA',
  place: '#7B92AD',
  placeL: '#EAEEF4',

  success: '#6A9E72',
  successL: '#EBF3EC',
  error: '#C0544A',
  errorL: '#FAEDEC',
  warning: '#C8903A',
  warningL: '#FBF0DC',
} as const;

export const colorsDark = {
  paper: '#1C1916',
  ink: '#F0EAE0',
  inkMuted: '#A89E92',
  inkFaint: '#5C544C',
  border: '#2E2924',
  surface: '#242018',
  overlay: 'rgba(0,0,0,0.65)',

  clay: '#E08B6A',
  clayLight: '#3A2218',
  clayDark: '#C06845',

  milestone: '#D4A857',
  milestoneL: '#2E2410',
  people: '#8A9B7E',
  peopleL: '#1A2218',
  place: '#7B92AD',
  placeL: '#141E2A',

  success: '#6A9E72',
  successL: '#141E16',
  error: '#C0544A',
  errorL: '#200E0D',
  warning: '#C8903A',
  warningL: '#201608',
} as const;

export const font = {
  display: { fontFamily: 'Fredoka_600SemiBold' },
  heading: { fontFamily: 'Fredoka_500Medium' },
  body: { fontFamily: 'Inter_400Regular' },
  bodyMed: { fontFamily: 'Inter_500Medium' },
  bodySemi: { fontFamily: 'Inter_600SemiBold' },
  label: { fontFamily: 'Inter_700Bold' },
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  display: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 22,
  full: 999,
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const shadow = {
  sm: {
    shadowColor: '#2B2925',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#2B2925',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  lg: {
    shadowColor: '#2B2925',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

export const animation = {
  snappy: { damping: 18, stiffness: 280 },
  gentle: { damping: 22, stiffness: 180 },
  bouncy: { damping: 14, stiffness: 320 },
} as const;

export type Colors = typeof colors;
export type ColorKey = keyof Colors;
export type FontVariant = keyof typeof font;
export type FontSizeKey = keyof typeof fontSize;
