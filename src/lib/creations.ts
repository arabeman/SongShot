import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNFS from '@dr.pogodin/react-native-fs';
import { v4 as uuid } from 'uuid';

export interface Creation {
  id: string;
  imagePath: string;
  videoPath: string;
  songName: string;
  startSec: number;
  durSec: number;
  createdAt: number;
}

const KEY = 'songshot_creations';

export const creationsDir = `${RNFS.DocumentDirectoryPath}/creations`;

export async function ensureCreationsDir(): Promise<void> {
  if (!(await RNFS.exists(creationsDir))) {
    await RNFS.mkdir(creationsDir);
  }
}

export function newCreationId(): string {
  return uuid();
}

export async function listCreations(): Promise<Creation[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const items: Creation[] = JSON.parse(raw);
    return items.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export async function getCreation(id: string): Promise<Creation | null> {
  const items = await listCreations();
  return items.find((c) => c.id === id) ?? null;
}

export async function addCreation(creation: Creation): Promise<void> {
  const items = await listCreations();
  await AsyncStorage.setItem(KEY, JSON.stringify([creation, ...items]));
}

export async function removeCreation(id: string): Promise<void> {
  const items = await listCreations();
  const target = items.find((c) => c.id === id);
  await AsyncStorage.setItem(KEY, JSON.stringify(items.filter((c) => c.id !== id)));
  if (target) {
    for (const path of [target.imagePath, target.videoPath]) {
      try {
        if (await RNFS.exists(path)) await RNFS.unlink(path);
      } catch {
        // best effort — orphaned files are harmless
      }
    }
  }
}
