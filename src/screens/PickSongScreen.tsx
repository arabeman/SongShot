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
import ScreenHeader from '../components/ScreenHeader';
import StepPips from '../components/StepPips';
import Sticker from '../components/Sticker';
import { NoteIcon } from '../components/icons';
import { formatTime } from '../components/WaveTrimmer';
import { probeDurationSec } from '../lib/media';
import { colors, fonts } from '../theme';
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
      <ScreenHeader title="Pick a song" onBack={() => navigation.goBack()} />
      <View style={{ paddingTop: 6, paddingBottom: 18 }}>
        <StepPips current={2} />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 24, gap: 20 }}>
        {/* The chosen photo stays visible for context */}
        <View style={{ alignItems: 'center' }}>
          <Sticker bg={colors.white} radius={20} offset={4} style={{ transform: [{ rotate: '-2deg' }] }}>
            <Image source={{ uri: imageUri }} style={{ width: 140, height: 140 }} resizeMode="cover" />
          </Sticker>
        </View>

        {loading ? (
          <Sticker bg={colors.white} radius={22} offset={4}>
            <View style={{ padding: 24, alignItems: 'center', gap: 10 }}>
              <ActivityIndicator color={colors.ink} />
              <Text style={{ fontFamily: fonts.bodyReg, fontSize: 14, color: colors.smoke }}>
                Reading your song…
              </Text>
            </View>
          </Sticker>
        ) : song ? (
          <Sticker bg={colors.white} radius={22} offset={4}>
            <View style={{ padding: 18, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 16,
                  borderWidth: 2.5,
                  borderColor: colors.ink,
                  backgroundColor: colors.sky,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <NoteIcon size={24} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.body, fontSize: 16, color: colors.ink }} numberOfLines={2}>
                  {song.name}
                </Text>
                {song.duration !== null && (
                  <Text style={{ fontFamily: fonts.bodyReg, fontSize: 13, color: colors.smoke }}>
                    {formatTime(song.duration)} long
                  </Text>
                )}
              </View>
            </View>
          </Sticker>
        ) : (
          <Sticker bg={colors.white} radius={22} offset={4}>
            <View style={{ padding: 24, alignItems: 'center', gap: 12 }}>
              <NoteIcon size={44} color={colors.steel} />
              <Text style={{ fontFamily: fonts.bodyReg, fontSize: 15, color: colors.smoke, textAlign: 'center' }}>
                Pick any audio file on your phone — MP3, M4A, WAV and friends.
              </Text>
            </View>
          </Sticker>
        )}

        <View style={{ gap: 12 }}>
          <BigButton
            label={song ? 'Swap song' : 'Browse my music'}
            variant={song ? 'ghost' : 'primary'}
            icon={<NoteIcon size={22} color={song ? colors.ink : colors.sky} />}
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
