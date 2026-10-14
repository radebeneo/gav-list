import './globals.css';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { AppProvider } from '../src/providers/app-provider';
import { SubscriptionProvider } from '../src/providers/SubscriptionContext';
import { colors } from '../src/config/theme';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

if (!publishableKey) {
  throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file.');
}

SplashScreen.preventAutoHideAsync();
WebBrowser.maybeCompleteAuthSession();

export default function AppLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Bold': require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-Light': require('../assets/fonts/Poppins/Poppins-Light.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
  });

  React.useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <AppProvider>
        <SubscriptionProvider>
          <View style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
              }}
            />
          </View>
        </SubscriptionProvider>
      </AppProvider>
    </ClerkProvider>
  );
}