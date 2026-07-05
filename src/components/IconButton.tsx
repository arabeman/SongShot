import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import { hapticSelection } from '../lib/haptics';
import { colors, radii, shadows } from '../theme';

interface Props {
  children: React.ReactNode;
  onPress: () => void;
  size?: number;
  bg?: string;
  style?: ViewStyle;
}

/** Round icon control: a small white surface, no outline. */
export default function IconButton({ children, onPress, size = 40, bg = colors.white, style }: Props) {
  return (
    <Pressable
      onPress={() => {
        hapticSelection();
        onPress();
      }}
      hitSlop={8}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: radii.pill,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.85 : 1,
        },
        shadows.control,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}
