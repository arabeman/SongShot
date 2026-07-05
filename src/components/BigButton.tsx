import React, { useState } from 'react';
import { Pressable, Text, View, ViewStyle } from 'react-native';
import { hapticLight } from '../lib/haptics';
import { colors, fonts } from '../theme';
import Sticker from './Sticker';

interface Props {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
}

export default function BigButton({ label, onPress, icon, variant = 'primary', disabled = false, style }: Props) {
  const [pressed, setPressed] = useState(false);
  const bg = variant === 'primary' ? colors.ink : colors.white;
  const fg = variant === 'primary' ? colors.sky : colors.ink;

  return (
    <Pressable
      onPress={() => {
        hapticLight();
        onPress();
      }}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled}
      style={[{ opacity: disabled ? 0.4 : 1 }, style]}
    >
      <Sticker bg={bg} radius={22} offset={4} pressed={pressed}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            paddingVertical: 16,
            paddingHorizontal: 24,
          }}
        >
          {icon}
          <Text style={{ fontFamily: fonts.body, fontSize: 17, color: fg }}>{label}</Text>
        </View>
      </Sticker>
    </Pressable>
  );
}
