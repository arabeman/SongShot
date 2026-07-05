import React from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { hapticHeavy, hapticLight } from '../lib/haptics';
import { Creation } from '../lib/creations';
import { shareCreationVideo } from '../lib/share';
import { colors, fonts, inkAlpha } from '../theme';
import Card from './Card';
import { formatTime } from './WaveTrimmer';
import { PlayIcon, ShareIcon, TrashIcon } from './icons';

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
    <Card style={{ marginBottom: 20 }}>
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
              right: 12,
              bottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: inkAlpha(0.82),
              borderRadius: 999,
              paddingHorizontal: 11,
              paddingVertical: 5,
            }}
          >
            <PlayIcon size={12} color={colors.white} />
            <Text style={{ fontFamily: fonts.label, fontSize: 12, color: colors.white }}>
              {creation.durSec.toFixed(0)}s
            </Text>
          </View>
        </View>
      </Pressable>

      <View style={{ paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1, gap: 2, paddingRight: 12 }}>
          <Text style={{ fontFamily: fonts.label, fontSize: 15, color: colors.ink }} numberOfLines={1}>
            {creation.songName}
          </Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.smoke }}>
            {formatTime(creation.startSec)} – {formatTime(creation.startSec + creation.durSec)} · {timeAgo(creation.createdAt)}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
          <Pressable onPress={share} hitSlop={10}>
            <ShareIcon size={20} color={colors.smoke} />
          </Pressable>
          <Pressable onPress={confirmDelete} hitSlop={10}>
            <TrashIcon size={20} color={colors.smoke} />
          </Pressable>
        </View>
      </View>
    </Card>
  );
}
