import React from 'react';
import { View } from 'react-native';
import { colors } from '../theme';

/** Quiet progress: three bars, the current one stretched. Titles name the steps. */
export default function StepMeter({ current }: { current: 1 | 2 | 3 }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      {([1, 2, 3] as const).map((step) => (
        <View
          key={step}
          style={{
            width: step === current ? 22 : 10,
            height: 4,
            borderRadius: 2,
            backgroundColor: step <= current ? colors.ink : colors.mist,
          }}
        />
      ))}
    </View>
  );
}
