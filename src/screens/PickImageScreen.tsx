import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BigButton from '../components/BigButton';
import ScreenHeader from '../components/ScreenHeader';
import StepPips from '../components/StepPips';
import Sticker from '../components/Sticker';
import { PhotoIcon } from '../components/icons';
import { colors, fonts } from '../theme';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'PickImage'>;

export default function PickImageScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pick = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
    if (result.didCancel) return;
    const uri = result.assets?.[0]?.uri;
    if (!uri) {
      Alert.alert("Couldn't open that image", 'Try picking a different one.');
      return;
    }
    setImageUri(uri);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.sky, paddingTop: insets.top }}>
      <ScreenHeader title="Pick a photo" onBack={() => navigation.goBack()} />
      <View style={{ paddingTop: 6, paddingBottom: 18 }}>
        <StepPips current={1} />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 24, gap: 20 }}>
        {imageUri ? (
          <Sticker bg={colors.white} radius={24} offset={5}>
            <Image source={{ uri: imageUri }} style={{ width: '100%', aspectRatio: 1 }} resizeMode="cover" />
          </Sticker>
        ) : (
          <Sticker bg={colors.white} radius={24} offset={5}>
            <View style={{ aspectRatio: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 }}>
              <PhotoIcon size={54} color={colors.steel} />
              <Text
                style={{ fontFamily: fonts.bodyReg, fontSize: 15, color: colors.smoke, textAlign: 'center' }}
              >
                This picture becomes the star of your video.
              </Text>
            </View>
          </Sticker>
        )}

        <View style={{ gap: 12 }}>
          <BigButton
            label={imageUri ? 'Swap photo' : 'Choose from gallery'}
            variant={imageUri ? 'ghost' : 'primary'}
            icon={<PhotoIcon size={22} color={imageUri ? colors.ink : colors.sky} />}
            onPress={pick}
          />
          {imageUri && (
            <BigButton
              label="Next: pick a song"
              onPress={() => navigation.navigate('PickSong', { imageUri })}
            />
          )}
        </View>
      </View>
    </View>
  );
}
