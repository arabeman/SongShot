import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

export function useCycleWord(words: string[], intervalMs = 3000) {
  const [idx, setIdx] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const id = setInterval(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(() => {
        setIdx((i) => (i + 1) % words.length);
        Animated.timing(opacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }).start();
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [opacity, words.length, intervalMs]);

  return { word: words[idx], opacity };
}
