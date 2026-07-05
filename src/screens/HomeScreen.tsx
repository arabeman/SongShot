import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { Animated, FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CreationCard from '../components/CreationCard';
import Sticker from '../components/Sticker';
import { HeartIcon, NoteIcon, PlusIcon } from '../components/icons';
import { Creation, listCreations, removeCreation } from '../lib/creations';
import { hapticLight, hapticSelection } from '../lib/haptics';
import { useCycleWord } from '../lib/useCycleWord';
import { colors, fonts } from '../theme';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const MOMENT_WORDS = ['chorus', 'beat drop', 'hook', 'guitar solo', 'bridge', 'high note'];

function EmptyFeed() {
  const { word, opacity } = useCycleWord(MOMENT_WORDS, 2600);
  return (
    <View style={{ alignItems: 'center', paddingTop: 70, paddingHorizontal: 30 }}>
      <Sticker bg={colors.white} radius={24} offset={5}>
        <View style={{ padding: 24, alignItems: 'center', gap: 12, width: 280 }}>
          <NoteIcon size={44} />
          <Text style={{ fontFamily: fonts.display, fontSize: 22, color: colors.ink, textAlign: 'center' }}>
            Every photo has a soundtrack
          </Text>
          <Text style={{ fontFamily: fonts.bodyReg, fontSize: 15, color: colors.smoke, textAlign: 'center' }}>
            Pick a picture, then pair it with the{' '}
            <Animated.Text style={{ fontFamily: fonts.body, color: colors.ink, opacity }}>{word}</Animated.Text>{' '}
            it deserves.
          </Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 14, color: colors.steel }}>
            Tap + to make your first SongShot
          </Text>
        </View>
      </Sticker>
    </View>
  );
}

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [creations, setCreations] = useState<Creation[]>([]);

  useFocusEffect(
    useCallback(() => {
      listCreations().then(setCreations);
    }, []),
  );

  const handleDelete = async (id: string) => {
    await removeCreation(id);
    setCreations(await listCreations());
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.sky, paddingTop: insets.top }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          height: 60,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              borderWidth: 2.5,
              borderColor: colors.ink,
              backgroundColor: colors.white,
              alignItems: 'center',
              justifyContent: 'center',
              transform: [{ rotate: '-6deg' }],
            }}
          >
            <NoteIcon size={20} />
          </View>
          <Text style={{ fontFamily: fonts.display, fontSize: 26, color: colors.ink }}>SongShot</Text>
        </View>
        <Pressable
          onPress={() => {
            hapticSelection();
            navigation.navigate('Support');
          }}
          hitSlop={8}
          style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            borderWidth: 2,
            borderColor: colors.ink,
            backgroundColor: colors.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <HeartIcon size={20} />
        </Pressable>
      </View>

      <FlatList
        data={creations}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 120 }}
        ListEmptyComponent={<EmptyFeed />}
        renderItem={({ item }) => (
          <CreationCard
            creation={item}
            onOpen={() => navigation.navigate('Result', { creationId: item.id })}
            onDelete={() => handleDelete(item.id)}
          />
        )}
      />

      {/* Compose FAB */}
      <Pressable
        onPress={() => {
          hapticLight();
          navigation.navigate('PickImage');
        }}
        style={({ pressed }) => ({
          position: 'absolute',
          right: 22,
          bottom: insets.bottom + 24,
          transform: [{ scale: pressed ? 0.94 : 1 }],
        })}
      >
        <Sticker bg={colors.ink} radius={999} offset={4}>
          <View style={{ width: 62, height: 62, alignItems: 'center', justifyContent: 'center' }}>
            <PlusIcon size={30} color={colors.sky} />
          </View>
        </Sticker>
      </Pressable>
    </View>
  );
}
