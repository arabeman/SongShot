import React from 'react';
import { Pressable, Text, View, ViewStyle } from 'react-native';
import { hapticLight } from '../lib/haptics';
import { colors, fonts, radii, shadows } from '../theme';

interface Props {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
}

export default function BigButton({ label, onPress, icon, variant = 'primary', disabled = false, style }: Props) {
  const primary = variant === 'primary';

  return (
    <Pressable
      onPress={() => {
        hapticLight();
        onPress();
      }}
      disabled={disabled}
      style={({ pressed }) => [
        { opacity: disabled ? 0.45 : pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
        style,
      ]}
    >
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            paddingVertical: 16,
            paddingHorizontal: 28,
            borderRadius: radii.pill,
            backgroundColor: primary ? colors.ink : colors.white,
          },
          primary ? shadows.control : { borderWidth: 1, borderColor: colors.mist },
        ]}
      >
        {icon}
        <Text style={{ fontFamily: fonts.label, fontSize: 16, color: primary ? colors.sky : colors.ink }}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
