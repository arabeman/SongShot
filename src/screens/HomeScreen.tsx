import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { Animated, FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import CreationCard from '../components/CreationCard';
import IconButton from '../components/IconButton';
import WaveMark from '../components/WaveMark';
import { HeartIcon, PlusIcon } from '../components/icons';
import { Creation, listCreations, removeCreation } from '../lib/creations';
import { hapticLight } from '../lib/haptics';
import { useCycleWord } from '../lib/useCycleWord';
import { colors, fonts, radii, shadows } from '../theme';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const MOMENT_WORDS = ['chorus', 'beat drop', 'hook', 'guitar solo', 'bridge', 'high note'];

function EmptyFeed() {
  const { word, opacity } = useCycleWord(MOMENT_WORDS, 2600);
  return (
    <View style={{ alignItems: 'center', paddingTop: 96, paddingHorizontal: 40, gap: 16 }}>
      <WaveMark size={44} color={colors.steel} />
      <Text
        style={{ fontFamily: fonts.display, fontSize: 24, color: colors.ink, textAlign: 'center', lineHeight: 31 }}
      >
        Every photo has a soundtrack
      </Text>
      <Text
        style={{ fontFamily: fonts.body, fontSize: 15, color: colors.smoke, textAlign: 'center', lineHeight: 22 }}
      >
        Pick a picture, then pair it with the{' '}
        <Animated.Text style={{ fontFamily: fonts.label, color: colors.ink, opacity }}>{word}</Animated.Text>{' '}
        it deserves.
      </Text>
    </View>
  );
}

/** A hand-placed note beside the FAB: tilted word, arrow swooping into the button. */
function FabHint() {
  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', bottom: 44, right: '50%', marginRight: 32, alignItems: 'flex-start' }}
    >
      <Text
        style={{
          fontFamily: fonts.display,
          fontSize: 14,
          color: colors.white,
          transform: [{ rotate: '-7deg' }],
        }}
      >
        make one
      </Text>
      <Svg width={30} height={24} viewBox="0 0 30 24" style={{ marginLeft: 28, marginTop: 2 }}>
        <Path
          d="M3 2 C 6 11, 14 18, 25 20"
          stroke={colors.white}
          strokeWidth={1.8}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M19 21.5 L25.5 20 L21.5 14.5"
          stroke={colors.white}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
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
          paddingHorizontal: 24,
          height: 64,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
          <WaveMark size={24} />
          <Text style={{ fontFamily: fonts.wordmark, fontSize: 25, color: colors.ink }}>SongShot</Text>
        </View>
        <IconButton onPress={() => navigation.navigate('Support')}>
          <HeartIcon size={19} />
        </IconButton>
      </View>

      <FlatList
        data={creations}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 10, paddingBottom: 130 }}
        ListEmptyComponent={<EmptyFeed />}
        renderItem={({ item }) => (
          <CreationCard
            creation={item}
            onOpen={() => navigation.navigate('Result', { creationId: item.id })}
            onDelete={() => handleDelete(item.id)}
          />
        )}
      />

      {/* Compose FAB — press transform stays on the wrapper, never on the
          elevated circle itself: elevation + transform on one node renders
          unreliably on Android. */}
      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: insets.bottom + 36,
          alignItems: 'center',
        }}
      >
        <Pressable
          onPress={() => {
            hapticLight();
            navigation.navigate('PickImage');
          }}
          style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.94 : 1 }] })}
        >
          <View
            style={[
              {
                width: 60,
                height: 60,
                borderRadius: radii.pill,
                backgroundColor: colors.ink,
                alignItems: 'center',
                justifyContent: 'center',
              },
              shadows.card,
            ]}
          >
            <PlusIcon size={28} color={colors.sky} />
          </View>
        </Pressable>
        {creations.length < 2 && <FabHint />}
      </View>
    </View>
  );
}
