import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppProvider } from '../src/providers/app-provider';

export default function AppLayout() {
  return (
    <AppProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#F7F4EC' },
          }}
        />
      </SafeAreaView>
    </AppProvider>
  );
}