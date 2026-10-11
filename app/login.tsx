import React, { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import { Button, Field, Message, shared } from '../src/components/ui';
import { useApp } from '../src/providers/app-provider';

export default function LoginScreen() {
  const { setGuestSession } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleGuest = async () => {
    try {
      await setGuestSession();
      router.replace('/');
    } catch (guestError) {
      setError(guestError instanceof Error ? guestError.message : 'Unable to start guest mode.');
    }
  };

  return (
    <View style={shared.screen}>
      <Text style={shared.title}>Gav List</Text>
      <Text style={shared.caption}>Keep your places private, or try the local guest demo.</Text>

      <View style={{ gap: 16, marginTop: 24 }}>
        <Field label="Email" value={email} onChangeText={setEmail} placeholder="email@example.com" />
        <Field label="Password" value={password} onChangeText={setPassword} placeholder="At least 6 chars" secureTextEntry />
        <Button title="Sign in" onPress={() => setError('Account sign-in is not configured in this local build.')} />
        <Button title="Continue as guest" onPress={() => void handleGuest()} />
      </View>

      {error ? <Message text={error} kind="error" /> : null}

      <View style={{ marginTop: 18, flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <Text style={shared.body}>Need an account?</Text>
        <Link href="/" asChild>
          <Pressable>
            <Text style={{ color: '#244F3D', fontWeight: '700' }}>Start here</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
