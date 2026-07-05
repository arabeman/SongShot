import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  errorCodes,
  isErrorWithCode,
  keepLocalCopy,
  pick,
  types,
} from '@react-native-documents/picker';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BigButton from '../components/BigButton';
import Card from '../components/Card';
import ScreenHeader from '../components/ScreenHeader';
import StepMeter from '../components/StepMeter';
import WaveMark from '../components/WaveMark';
import { formatTime } from '../components/WaveTrimmer';
import { probeDurationSec } from '../lib/media';
import { colors, fonts, radii } from '../theme';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'PickSong'>;

interface PickedSong {
  uri: string;
  name: string;
  duration: number | null;
}

export default function PickSongScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { imageUri } = route.params;
  const [song, setSong] = useState<PickedSong | null>(null);
  const [loading, setLoading] = useState(false);

  const pickSong = async () => {
    try {
      const [file] = await pick({ type: [types.audio] });
      setLoading(true);
      const name = file.name ?? 'Untitled track';
      // Copy out of the SAF sandbox so FFmpeg and the player get a plain file path.
      const [copy] = await keepLocalCopy({
        files: [{ uri: file.uri, fileName: name }],
        destination: 'cachesDirectory',
      });
      if (copy.status !== 'success') {
        throw new Error('copy failed');
      }
      const duration = await probeDurationSec(copy.localUri);
      setSong({ uri: copy.localUri, name, duration });
    } catch (e) {
      if (isErrorWithCode(e) && e.code === errorCodes.OPERATION_CANCELED) return;
      Alert.alert("Couldn't read that song", 'Pick an audio file stored on this device (MP3, M4A, WAV…).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.sky, paddingTop: insets.top }}>
      <ScreenHeader
        title="Pick the song"
        subtitle="Any audio file on your phone works."
        onBack={() => navigation.goBack()}
        right={<StepMeter current={2} />}
      />

      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24, gap: 20 }}>
        {/* The chosen photo stays visible for context */}
        <View style={{ alignItems: 'center' }}>
          <Card radius={18}>
            <Image source={{ uri: imageUri }} style={{ width: 128, height: 128 }} resizeMode="cover" />
          </Card>
        </View>

        {loading ? (
          <Card>
            <View style={{ padding: 24, alignItems: 'center', gap: 10 }}>
              <ActivityIndicator color={colors.ink} />
              <Text style={{ fontFamily: fonts.body, fontSize: 14, color: colors.smoke }}>
                Reading your song…
              </Text>
            </View>
          </Card>
        ) : song ? (
          <Card>
            <View style={{ padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: radii.control,
                  backgroundColor: colors.sky,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <WaveMark size={20} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ fontFamily: fonts.label, fontSize: 16, color: colors.ink }} numberOfLines={2}>
                  {song.name}
                </Text>
                {song.duration !== null && (
                  <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.smoke }}>
                    {formatTime(song.duration)} long
                  </Text>
                )}
              </View>
            </View>
          </Card>
        ) : (
          // Empty slot, echoing the photo step
          <View
            style={{
              borderRadius: radii.card,
              backgroundColor: 'rgba(255,255,255,0.5)',
              alignItems: 'center',
              gap: 12,
              padding: 28,
            }}
          >
            <WaveMark size={36} color={colors.steel} />
            <Text style={{ fontFamily: fonts.body, fontSize: 14, color: colors.smoke, textAlign: 'center' }}>
              MP3, M4A, WAV — whatever is on this device.
            </Text>
          </View>
        )}

        <View style={{ gap: 12 }}>
          <BigButton
            label={song ? 'Swap song' : 'Browse my music'}
            variant={song ? 'ghost' : 'primary'}
            onPress={pickSong}
            disabled={loading}
          />
          {song && (
            <BigButton
              label="Next: choose the moment"
              onPress={() =>
                navigation.navigate('Trim', {
                  imageUri,
                  songUri: song.uri,
                  songName: song.name,
                  songDuration: song.duration,
                })
              }
            />
          )}
        </View>
      </View>
    </View>
  );
}
