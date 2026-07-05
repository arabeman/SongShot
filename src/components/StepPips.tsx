import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '../theme';

const STEPS = ['Photo', 'Song', 'Moment'];

export default function StepPips({ current }: { current: 1 | 2 | 3 }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 18 }}>
      {STEPS.map((label, i) => {
        const active = i + 1 === current;
        const done = i + 1 < current;
        return (
          <View key={label} style={{ alignItems: 'center', gap: 4 }}>
            <View
              style={{
                width: active ? 34 : 12,
                height: 12,
                borderRadius: 6,
                borderWidth: 2,
                borderColor: colors.ink,
                backgroundColor: active || done ? colors.ink : colors.white,
              }}
            />
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: 11,
                color: active ? colors.ink : colors.steel,
              }}
            >
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
