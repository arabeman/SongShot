import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BigButton from '../components/BigButton';
import Card from '../components/Card';
import ScreenHeader from '../components/ScreenHeader';
import { StarIcon } from '../components/icons';
import { openPlayStoreRating } from '../lib/links';
import { colors, fonts } from '../theme';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Support'>;

export default function SupportScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.sky, paddingTop: insets.top }}>
      <ScreenHeader
        title="Support SongShot"
        subtitle="Made by one person, kept alive by you."
        onBack={() => navigation.goBack()}
      />

      <View style={{ paddingHorizontal: 24, paddingTop: 24, gap: 20 }}>
        <Card>
          <View style={{ padding: 24, gap: 12 }}>
            <View style={{ flexDirection: 'row', gap: 3 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <StarIcon key={i} size={20} />
              ))}
            </View>
            <Text style={{ fontFamily: fonts.display, fontSize: 20, color: colors.ink }}>
              Enjoying SongShot?
            </Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 15, color: colors.smoke, lineHeight: 22 }}>
              A rating on Google Play helps other people find the app.
            </Text>
            <BigButton
              label="Rate on Google Play"
              icon={<StarIcon size={18} color={colors.sky} />}
              onPress={openPlayStoreRating}
              style={{ marginTop: 6 }}
            />
          </View>
        </Card>

        <Text
          style={{
            fontFamily: fonts.body,
            fontSize: 13,
            color: colors.steel,
            textAlign: 'center',
            paddingBottom: insets.bottom + 12,
          }}
        >
          Thanks for being here — it means a lot. ♪
        </Text>
      </View>
    </View>
  );
}
