import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import PickImageScreen from './screens/PickImageScreen';
import PickSongScreen from './screens/PickSongScreen';
import ResultScreen from './screens/ResultScreen';
import SupportScreen from './screens/SupportScreen';
import TrimScreen from './screens/TrimScreen';
import { colors } from './theme';
import { RootStackParamList } from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={colors.sky} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: colors.sky },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="PickImage" component={PickImageScreen} />
          <Stack.Screen name="PickSong" component={PickSongScreen} />
          <Stack.Screen name="Trim" component={TrimScreen} />
          <Stack.Screen name="Result" component={ResultScreen} options={{ animation: 'fade_from_bottom' }} />
          <Stack.Screen name="Support" component={SupportScreen} options={{ animation: 'fade_from_bottom' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
