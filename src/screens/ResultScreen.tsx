import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Alert, PermissionsAndroid, Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import BigButton from '../components/BigButton';
import Card from '../components/Card';
import IconButton from '../components/IconButton';
import ScreenHeader from '../components/ScreenHeader';
import { DownloadIcon, MuteIcon, PlayIcon, ShareIcon, VolumeIcon } from '../components/icons';
import { Creation, getCreation } from '../lib/creations';
import { hapticLight } from '../lib/haptics';
import { shareCreationVideo } from '../lib/share';
import { colors, fonts, radii, shadows } from '../theme';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

async function ensureLegacyWritePermission(): Promise<boolean> {
  if (Platform.OS !== 'android' || Number(Platform.Version) >= 29) return true;
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export default function ResultScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const [creation, setCreation] = useState<Creation | null>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCreation(route.params.creationId).then(setCreation);
  }, [route.params.creationId]);

  const saveToGallery = async () => {
    if (!creation) return;
    hapticLight();
    if (!(await ensureLegacyWritePermission())) {
      Alert.alert('Permission needed', 'Allow storage access to save videos to your gallery.');
      return;
    }
    setSaving(true);
    try {
      await CameraRoll.save(`file://${creation.videoPath}`, { type: 'video', album: 'SongShot' });
      Alert.alert('Saved', 'Your SongShot is in the gallery, ready to post anywhere.');
    } catch {
      Alert.alert("Couldn't save", 'Something blocked the save. Try the Share button instead.');
    } finally {
      setSaving(false);
    }
  };

  const share = () => {
    if (!creation) return;
    hapticLight();
    shareCreationVideo(creation.videoPath);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.sky, paddingTop: insets.top }}>
      <ScreenHeader title="Ready to share" onBack={() => navigation.navigate('Home')} />

      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24, gap: 20 }}>
        {creation && (
          <>
            <Pressable onPress={() => setPlaying((p) => !p)}>
              <Card bg={colors.ink}>
                <View style={{ aspectRatio: 1, backgroundColor: colors.ink }}>
                  <Video
                    source={{ uri: `file://${creation.videoPath}` }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                    paused={!playing || !isFocused}
                    muted={muted}
                    playInBackground={false}
                    repeat
                  />
                  {!playing && (
                    <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
                      <View
                        style={[
                          {
                            width: 56,
                            height: 56,
                            borderRadius: radii.pill,
                            backgroundColor: 'rgba(255,255,255,0.92)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingLeft: 4,
                          },
                          shadows.control,
                        ]}
                      >
                        <PlayIcon size={24} />
                      </View>
                    </View>
                  )}
                  <IconButton
                    onPress={() => setMuted((m) => !m)}
                    bg="rgba(255,255,255,0.92)"
                    style={{ position: 'absolute', top: 12, right: 12 }}
                  >
                    {muted ? <MuteIcon size={19} /> : <VolumeIcon size={19} />}
                  </IconButton>
                </View>
              </Card>
            </Pressable>

            <View style={{ alignItems: 'center', gap: 2 }}>
              <Text style={{ fontFamily: fonts.label, fontSize: 15, color: colors.ink }} numberOfLines={1}>
                {creation.songName}
              </Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.smoke }}>
                {creation.durSec.toFixed(0)}s · saved to your feed
              </Text>
            </View>

            <View style={{ gap: 12 }}>
              <BigButton
                label={saving ? 'Saving…' : 'Save to gallery'}
                icon={<DownloadIcon size={20} color={colors.sky} />}
                onPress={saveToGallery}
                disabled={saving}
              />
              <BigButton
                label="Share it"
                variant="ghost"
                icon={<ShareIcon size={20} color={colors.ink} />}
                onPress={share}
              />
            </View>
          </>
        )}
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 16 }}>
        <Pressable onPress={() => navigation.navigate('Home')}>
          <Text style={{ fontFamily: fonts.label, fontSize: 15, color: colors.smoke, textAlign: 'center' }}>
            Back to my feed
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
