import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { hapticSelection } from '../lib/haptics';
import { colors, fonts } from '../theme';
import { BackIcon } from './icons';

interface Props {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

export default function ScreenHeader({ title, onBack, right }: Props) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, height: 56 }}>
      <View style={{ width: 44 }}>
        {onBack && (
          <Pressable
            onPress={() => {
              hapticSelection();
              onBack();
            }}
            hitSlop={8}
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              borderWidth: 2,
              borderColor: colors.ink,
              backgroundColor: colors.white,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BackIcon size={20} />
          </Pressable>
        )}
      </View>
      <Text
        style={{
          flex: 1,
          textAlign: 'center',
          fontFamily: fonts.display,
          fontSize: 22,
          color: colors.ink,
        }}
        numberOfLines={1}
      >
        {title}
      </Text>
      <View style={{ width: 44, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}
