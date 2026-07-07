import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BigButton from '../components/BigButton';
import Card from '../components/Card';
import ScreenHeader from '../components/ScreenHeader';
import StepMeter from '../components/StepMeter';
import { PhotoIcon } from '../components/icons';
import { colors, fonts, radii } from '../theme';
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
      Alert.alert("Couldn't open that picture", 'Try picking a different one.');
      return;
    }
    setImageUri(uri);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.sky, paddingTop: insets.top }}>
      <ScreenHeader
        title="Pick a picture"
        subtitle="Your video is built around one picture."
        onBack={() => navigation.goBack()}
        right={<StepMeter current={1} />}
      />

      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24, gap: 20 }}>
        {imageUri ? (
          <Card>
            <Image source={{ uri: imageUri }} style={{ width: '100%', aspectRatio: 1 }} resizeMode="cover" />
          </Card>
        ) : (
          // An empty slot, not yet a surface — it fills in once a photo is chosen.
          <View
            style={{
              aspectRatio: 1,
              borderRadius: radii.card,
              backgroundColor: 'rgba(255,255,255,0.5)',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: 24,
            }}
          >
            <PhotoIcon size={46} color={colors.steel} />
            <Text style={{ fontFamily: fonts.body, fontSize: 14, color: colors.smoke, textAlign: 'center' }}>
              The picture you choose shows up here.
            </Text>
          </View>
        )}

        <View style={{ gap: 12 }}>
          <BigButton
            label={imageUri ? 'Swap picture' : 'Choose from gallery'}
            variant={imageUri ? 'ghost' : 'primary'}
            icon={<PhotoIcon size={20} color={imageUri ? colors.ink : colors.sky} />}
            onPress={pick}
          />
          {imageUri && (
            <BigButton
              label="Next: pick the song"
              onPress={() => navigation.navigate('PickSong', { imageUri })}
            />
          )}
        </View>
      </View>
    </View>
  );
}
