import { ViewStyle } from 'react-native';

export const colors = {
  sky: '#C9E3F5', // app background
  mist: '#B2C8D4', // hairlines, inactive fills, quiet chips
  steel: '#9AB1C2', // placeholder icons and tertiary text
  smoke: '#595E5E', // secondary text
  ink: '#3C464B', // primary text and the one primary action per screen
  white: '#FFFFFF',
} as const;

/** colors.ink with alpha — for scrims and translucent chips. */
export const inkAlpha = (a: number) => `rgba(60, 70, 75, ${a})`;

/** colors.sky with alpha — tonal dimming instead of black/white washes. */
export const skyAlpha = (a: number) => `rgba(201, 227, 245, ${a})`;

export const fonts = {
  wordmark: 'BricolageGrotesque-Bold', // the SongShot wordmark only
  display: 'BricolageGrotesque-SemiBold', // screen titles and headlines
  label: 'Nunito-SemiBold', // buttons, chips, emphasized rows
  body: 'Nunito-Regular', // running text and captions
} as const;

export const radii = {
  card: 20,
  control: 16,
  pill: 999,
} as const;

/** Soft ink-tinted elevation — surfaces float on the sky, no outlines. */
export const shadows: Record<'card' | 'control', ViewStyle> = {
  card: {
    shadowColor: colors.ink,
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  control: {
    shadowColor: colors.ink,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
};
