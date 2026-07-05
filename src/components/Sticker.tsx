import { StyleSheet, View, ViewStyle } from 'react-native';

import React from 'react';
import { colors } from '../theme';

interface Props {
  children: React.ReactNode;
  bg?: string;
  radius?: number;
  offset?: number;
  borderWidth?: number;
  style?: ViewStyle;
  pressed?: boolean;
}

export default function Sticker({
  children,
  bg = '#fff',
  radius = 18,
  offset = 4,
  borderWidth = 2.5,
  style,
  pressed = false,
}: Props) {
  const flat = StyleSheet.flatten(style) ?? {};
  const cardW = typeof flat.width === 'number' ? flat.width - offset : undefined;
  const cardH = typeof flat.height === 'number' ? flat.height - offset : undefined;

  return (
    <View style={[{ paddingRight: offset, paddingBottom: offset }, style]}>
      {/* Solid offset shadow */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: offset,
          top: offset,
          backgroundColor: colors.ink,
          borderRadius: radius,
        }}
      />
      {/* Card face */}
      <View
        style={{
          width: cardW,
          height: cardH,
          backgroundColor: bg,
          borderWidth,
          borderColor: colors.ink,
          borderRadius: radius,
          overflow: 'hidden',
          ...(pressed && { transform: [{ translateX: offset }, { translateY: offset }] }),
        }}
      >
        {children}
      </View>
    </View>
  );
}