import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as RNFS from '@dr.pogodin/react-native-fs';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BigButton from '../components/BigButton';
import ScreenHeader from '../components/ScreenHeader';
import StepPips from '../components/StepPips';
import Sticker from '../components/Sticker';
import WaveTrimmer from '../components/WaveTrimmer';
import { PauseIcon, PlayIcon, SparkleIcon } from '../components/icons';
import { addCreation, creationsDir, ensureCreationsDir, newCreationId } from '../lib/creations';
import { hapticHeavy } from '../lib/haptics';
import { exportCreationVideo, renderWaveformPng, uriToPath } from '../lib/media';
import { colors, fonts } from '../theme';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Trim'>;

const DEFAULT_CLIP_SEC = 15;

function imageExtension(uri: string): string {
  const match = uri.match(/\.(jpe?g|png|webp|gif|heic)$/i);
  return match ? match[1].toLowerCase() : 'jpg';
}

export default function TrimScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { imageUri, songUri, songName, songDuration } = route.params;

  const [duration, setDuration] = useState<number | null>(songDuration);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(songDuration ? Math.min(DEFAULT_CLIP_SEC, songDuration) : DEFAULT_CLIP_SEC);
  const [playing, setPlaying] = useState(false);
  const [playhead, setPlayhead] = useState<number | null>(null);
  const [waveformUri, setWaveformUri] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState<number | null>(null);

  const videoRef = useRef<VideoRef>(null);
  const windowRef = useRef({ start, end });
  windowRef.current = { start, end };

  // Silence the hidden preview player as soon as the screen starts to blur,
  // so the song never keeps playing over other screens.
  useFocusEffect(
    useCallback(
      () => () => {
        setPlaying(false);
        setPlayhead(null);
      },
      [],
    ),
  );

  useEffect(() => {
    let alive = true;
    const wavePath = `${RNFS.CachesDirectoryPath}/songshot-wave.png`;
    renderWaveformPng(songUri, wavePath).then((path) => {
      // Cache-bust: the Image component keys on the URI, which is reused per song.
      if (alive && path) setWaveformUri(`${path}?t=${Date.now()}`);
    });
    return () => {
      alive = false;
    };
  }, [songUri]);

  const togglePlay = () => {
    if (!playing) {
      videoRef.current?.seek(windowRef.current.start);
      setPlayhead(windowRef.current.start);
    }
    setPlaying((p) => !p);
  };

  const onWindowChange = (s: number, e: number) => {
    setStart(s);
    setEnd(e);
    if (playing) {
      setPlaying(false);
      setPlayhead(null);
    }
  };

  const onProgress = ({ currentTime }: { currentTime: number }) => {
    if (!playing) return;
    setPlayhead(currentTime);
    if (currentTime >= windowRef.current.end) {
      videoRef.current?.seek(windowRef.current.start);
    }
  };

  const exportNow = async () => {
    setPlaying(false);
    setPlayhead(null);
    setExportProgress(0);
    try {
      await ensureCreationsDir();
      const id = newCreationId();
      const imagePath = `${creationsDir}/${id}.${imageExtension(imageUri)}`;
      const videoPath = `${creationsDir}/${id}.mp4`;
      await RNFS.copyFile(uriToPath(imageUri), imagePath);
      const durSec = end - start;
      await exportCreationVideo({
        imageUri,
        songUri,
        startSec: start,
        durSec,
        outPath: videoPath,
        onProgress: setExportProgress,
      });
      await addCreation({
        id,
        imagePath,
        videoPath,
        songName,
        startSec: start,
        durSec,
        createdAt: Date.now(),
      });
      hapticHeavy();
      navigation.reset({
        index: 1,
        routes: [{ name: 'Home' }, { name: 'Result', params: { creationId: id } }],
      });
    } catch {
      setExportProgress(null);
      Alert.alert(
        "Couldn't create the video",
        'Something went wrong while mixing. Try a different song file or a shorter clip.',
      );
    }
  };

  const ready = duration !== null && duration > 0;
  const exporting = exportProgress !== null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.sky, paddingTop: insets.top }}>
      <ScreenHeader title="Choose the moment" onBack={() => navigation.goBack()} />
      <View style={{ paddingTop: 6, paddingBottom: 14 }}>
        <StepPips current={3} />
      </View>

      {/* Hidden preview player for the song */}
      <Video
        ref={videoRef}
        source={{ uri: songUri }}
        paused={!playing}
        onLoad={(meta) => {
          if (duration === null && meta.duration > 0) {
            setDuration(meta.duration);
            setEnd(Math.min(DEFAULT_CLIP_SEC, meta.duration));
          }
        }}
        onProgress={onProgress}
        progressUpdateInterval={200}
        playInBackground={false}
        style={{ width: 0, height: 0 }}
      />

      <View style={{ flex: 1, paddingHorizontal: 24, gap: 22 }}>
        {/* Tap the photo to preview the selected slice */}
        <View style={{ alignItems: 'center' }}>
          <Pressable onPress={togglePlay} disabled={!ready}>
            <Sticker bg={colors.white} radius={24} offset={5}>
              <View>
                <Image source={{ uri: imageUri }} style={{ width: 230, height: 230 }} resizeMode="cover" />
                <View
                  style={{
                    position: 'absolute',
                    inset: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: 999,
                      borderWidth: 2.5,
                      borderColor: colors.ink,
                      backgroundColor: 'rgba(255,255,255,0.92)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingLeft: playing ? 0 : 4,
                    }}
                  >
                    {playing ? <PauseIcon size={26} /> : <PlayIcon size={26} />}
                  </View>
                </View>
              </View>
            </Sticker>
          </Pressable>
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ fontFamily: fonts.body, fontSize: 14, color: colors.smoke, textAlign: 'center' }}>
            Drag the edges to trim · drag the middle to move · tap to jump
          </Text>
          {ready ? (
            <WaveTrimmer
              durationSec={duration}
              waveformUri={waveformUri ? waveformUri.split('?')[0] : null}
              songName={songName}
              start={start}
              end={end}
              onWindowChange={onWindowChange}
              playheadSec={playing ? playhead : null}
            />
          ) : (
            <Text style={{ fontFamily: fonts.bodyReg, fontSize: 14, color: colors.steel, textAlign: 'center' }}>
              Listening to the song…
            </Text>
          )}
        </View>

        <BigButton
          label="Voilà — make my SongShot"
          icon={<SparkleIcon size={22} color={colors.sky} />}
          onPress={exportNow}
          disabled={!ready || exporting}
        />
      </View>

      {/* Export overlay */}
      {exporting && (
        <View
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(201,227,245,0.93)',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 40,
          }}
        >
          <Sticker bg={colors.white} radius={24} offset={5}>
            <View style={{ padding: 26, alignItems: 'center', gap: 16, width: 280 }}>
              <SparkleIcon size={40} />
              <Text style={{ fontFamily: fonts.display, fontSize: 20, color: colors.ink }}>
                Mixing your SongShot…
              </Text>
              <View
                style={{
                  alignSelf: 'stretch',
                  height: 16,
                  borderRadius: 999,
                  borderWidth: 2,
                  borderColor: colors.ink,
                  backgroundColor: colors.sky,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    width: `${Math.round((exportProgress ?? 0) * 100)}%`,
                    height: '100%',
                    backgroundColor: colors.ink,
                  }}
                />
              </View>
              <Text style={{ fontFamily: fonts.body, fontSize: 14, color: colors.smoke }}>
                {Math.round((exportProgress ?? 0) * 100)}%
              </Text>
            </View>
          </Sticker>
        </View>
      )}
    </View>
  );
}
