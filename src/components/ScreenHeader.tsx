import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { BackIcon } from './icons';
import IconButton from './IconButton';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

/**
 * Nav row on top, then a left-aligned display title.
 * `right` sits opposite the back button (step meter, actions).
 */
export default function ScreenHeader({ title, subtitle, onBack, right }: Props) {
  return (
    <View style={{ paddingHorizontal: 24 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <View>{onBack && (
          <IconButton onPress={onBack}>
            <BackIcon size={20} />
          </IconButton>
        )}</View>
        <View>{right}</View>
      </View>
      <Text style={{ fontFamily: fonts.display, fontSize: 27, color: colors.ink, paddingTop: 4 }}>{title}</Text>
      {subtitle && (
        <Text style={{ fontFamily: fonts.body, fontSize: 14, color: colors.smoke, paddingTop: 4 }}>{subtitle}</Text>
      )}
    </View>
  );
}
