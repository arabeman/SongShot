import React from 'react';
import { View } from 'react-native';
import { colors } from '../theme';

const HEIGHTS = [0.38, 0.72, 1, 0.55, 0.82];

/** The SongShot mark: five sound bars. Doubles as the brand glyph. */
export default function WaveMark({ size = 26, color = colors.ink }: { size?: number; color?: string }) {
  const barWidth = Math.max(2, Math.round(size * 0.13));
  return (
    <View
      style={{
        width: size,
        height: size,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {HEIGHTS.map((h, i) => (
        <View
          key={i}
          style={{ width: barWidth, height: size * h, borderRadius: barWidth / 2, backgroundColor: color }}
        />
      ))}
    </View>
  );
}
