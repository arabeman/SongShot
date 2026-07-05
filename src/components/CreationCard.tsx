import React from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { hapticHeavy, hapticLight } from '../lib/haptics';
import { Creation } from '../lib/creations';
import { shareCreationVideo } from '../lib/share';
import { colors, fonts } from '../theme';
import Sticker from './Sticker';
import { formatTime } from './WaveTrimmer';
import { NoteIcon, PlayIcon, ShareIcon, TrashIcon } from './icons';

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'yesterday' : `${d}d ago`;
}

interface Props {
  creation: Creation;
  onOpen: () => void;
  onDelete: () => void;
}

export default function CreationCard({ creation, onOpen, onDelete }: Props) {
  const share = () => {
    hapticLight();
    shareCreationVideo(creation.videoPath);
  };

  const confirmDelete = () => {
    hapticHeavy();
    Alert.alert('Delete this SongShot?', 'The video will be removed from your feed.', [
      { text: 'Keep it', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <Sticker bg={colors.white} radius={20} offset={4} style={{ marginBottom: 18 }}>
      <Pressable onPress={onOpen}>
        <View style={{ aspectRatio: 4 / 3, backgroundColor: colors.mist }}>
          <Image
            source={{ uri: `file://${creation.imagePath}` }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          <View
            style={{
              position: 'absolute',
              right: 10,
              bottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: colors.ink,
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <PlayIcon size={13} color={colors.sky} />
            <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.sky }}>
              {creation.durSec.toFixed(0)}s
            </Text>
          </View>
        </View>
      </Pressable>

      <View style={{ padding: 14, gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <NoteIcon size={18} />
          <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 15, color: colors.ink }} numberOfLines={1}>
            {creation.songName}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ flex: 1, fontFamily: fonts.bodyReg, fontSize: 13, color: colors.smoke }}>
            {formatTime(creation.startSec)} – {formatTime(creation.startSec + creation.durSec)} · {timeAgo(creation.createdAt)}
          </Text>
          <View style={{ flexDirection: 'row', gap: 18, alignItems: 'center' }}>
            <Pressable onPress={share} hitSlop={10}>
              <ShareIcon size={20} color={colors.smoke} />
            </Pressable>
            <Pressable onPress={confirmDelete} hitSlop={10}>
              <TrashIcon size={20} color={colors.smoke} />
            </Pressable>
          </View>
        </View>
      </View>
    </Sticker>
  );
}
