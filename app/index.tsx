import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, Redirect, type Href } from 'expo-router';
import { Button, colors, shared } from '../src/components/ui';
import { useApp } from '../src/providers/app-provider';

export default function EntryScreen() {
  const { sessionMode, isLoading, setGuestSession } = useApp();

  if (isLoading) {
    return (
      <SafeAreaView style={[shared.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.green} />
      </SafeAreaView>
    );
  }

  if (sessionMode) {
    return <Redirect href={"/(app)/(tabs)" as Href} />;
  }

  return (
    <SafeAreaView style={[shared.screen, { justifyContent: 'center', gap: 16 }]}>
      <Text style={shared.title}>Gav List</Text>
      <Text style={shared.caption}>
        Keep track of places you want to visit, search them on Google Maps, and check them off your bucket list.
      </Text>

      <View style={{ marginTop: 20, gap: 12 }}>
        <Button
          title="Continue as Guest"
          onPress={() => {
            void setGuestSession();
          }}
        />

        <Link href={"/(auth)/sign-in" as Href} asChild>
          <Pressable style={StyleSheet.flatten([shared.action, { backgroundColor: colors.green }])}>
            <Text style={shared.actionText}>Sign in to your account</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}
