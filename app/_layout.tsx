import "react-native-get-random-values"; // BU EN ÜSTTE OLMALI!

import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import { SecurityProvider, useSecurity } from '@/hooks/useSecurity';
import { WalletProvider, useWallet } from '@/hooks/useWallet';

SplashScreen.preventAutoHideAsync();

const AppLayout = () => {
  const router = useRouter();
  const segments = useSegments();
  const { isUnlocked, hasPin, lock } = useSecurity();
  const { refreshData } = useWallet(); // Get the refresh function

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (hasPin && !isUnlocked && !inAuthGroup) {
      router.replace('/(auth)/lock-screen');
    } else if ((isUnlocked || !hasPin) && inAuthGroup) {
      router.replace('/(wallet)');
    }
    SplashScreen.hideAsync();

  }, [isUnlocked, hasPin, segments, router]);
 
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState.match(/inactive|background/)) {
        lock();
      } else if (nextAppState === 'active') {
        console.log('App is active, refreshing data...');
        refreshData();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [lock, refreshData]);

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="(wallet)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="(auth)/lock-screen" options={{ gestureEnabled: false }} />
        <Stack.Screen name="+not-found" />
    </Stack>
  );
};

export default function RootLayout() {

  return (
    <SecurityProvider>
      <WalletProvider>
        <AppLayout />
        <Toast />
      </WalletProvider>
    </SecurityProvider>
  );
}
