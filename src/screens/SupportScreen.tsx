import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BigButton from '../components/BigButton';
import ScreenHeader from '../components/ScreenHeader';
import Sticker from '../components/Sticker';
import { HeartIcon, StarIcon } from '../components/icons';
import { openPatreon, openPlayStoreRating } from '../lib/links';
import { colors, fonts } from '../theme';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Support'>;

export default function SupportScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.sky, paddingTop: insets.top }}>
      <ScreenHeader title="Support SongShot" onBack={() => navigation.goBack()} />

      <View style={{ paddingHorizontal: 24, paddingTop: 16, gap: 24 }}>
        <Sticker bg={colors.white} radius={24} offset={5}>
          <View style={{ padding: 22, gap: 14, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <StarIcon key={i} size={26} />
              ))}
            </View>
            <Text style={{ fontFamily: fonts.display, fontSize: 21, color: colors.ink, textAlign: 'center' }}>
              Enjoying SongShot?
            </Text>
            <Text style={{ fontFamily: fonts.bodyReg, fontSize: 15, color: colors.smoke, textAlign: 'center' }}>
              A quick rating on Google Play helps other music-loving photo hoarders find the app.
            </Text>
            <BigButton
              label="Rate on Google Play"
              icon={<StarIcon size={20} color={colors.sky} />}
              onPress={openPlayStoreRating}
              style={{ alignSelf: 'stretch' }}
            />
          </View>
        </Sticker>

        <Sticker bg={colors.white} radius={24} offset={5}>
          <View style={{ padding: 22, gap: 14, alignItems: 'center' }}>
            <HeartIcon size={34} filled />
            <Text style={{ fontFamily: fonts.display, fontSize: 21, color: colors.ink, textAlign: 'center' }}>
              Fuel the next feature
            </Text>
            <Text style={{ fontFamily: fonts.bodyReg, fontSize: 15, color: colors.smoke, textAlign: 'center' }}>
              SongShot is made by one person. Patreon supporters keep new ideas (and coffee) flowing.
            </Text>
            <BigButton
              label="Support on Patreon"
              variant="ghost"
              icon={<HeartIcon size={20} color={colors.ink} />}
              onPress={openPatreon}
              style={{ alignSelf: 'stretch' }}
            />
          </View>
        </Sticker>

        <Text
          style={{
            fontFamily: fonts.bodyReg,
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
