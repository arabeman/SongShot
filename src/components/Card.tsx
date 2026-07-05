import React from 'react';
import { View, ViewStyle } from 'react-native';
import { colors, radii, shadows } from '../theme';

interface Props {
  children: React.ReactNode;
  bg?: string;
  radius?: number;
  style?: ViewStyle;
}

/**
 * A surface floating on the sky: soft ink-tinted shadow, no outline.
 * The inner view clips children (images, progress fills) to the radius
 * without cutting the shadow off.
 */
export default function Card({ children, bg = colors.white, radius = radii.card, style }: Props) {
  return (
    <View style={[{ backgroundColor: bg, borderRadius: radius }, shadows.card, style]}>
      <View style={{ borderRadius: radius, overflow: 'hidden' }}>{children}</View>
    </View>
  );
}
