import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Button, colors, Message, shared } from '../src/components/ui';
import { buildGoogleMapsSearchUrl } from '../src/lib/places';
import { useApp } from '../src/providers/app-provider';

export default function DashboardScreen() {
  const { places, sessionMode, isLoading, error, signOut, toggleVisited, removePlace } = useApp();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return places.filter((place) => {
      if (!normalized) return true;
      const haystack = [place.name, place.address, place.category, place.notes ?? '']
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [places, query]);

  if (isLoading) {
    return (
      <View style={[shared.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }

  if (!sessionMode) {
    return (
      <View style={shared.screen}>
        <Text style={shared.title}>Session required</Text>
        <Text style={shared.caption}>Choose a guest session or sign in to view your list.</Text>
        <View style={{ marginTop: 18 }}>
          <Link href="/login" asChild>
            <Pressable>
              <Text style={{ color: colors.green, fontWeight: '700' }}>Go to login</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    );
  }

  return (
    <View style={shared.screen}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={shared.title}>Saved places</Text>
        <Pressable onPress={signOut}>
          <Text style={{ color: colors.green, fontWeight: '700' }}>Sign out</Text>
        </Pressable>
      </View>

      {error ? <Message text={error} kind="error" /> : null}

      <View style={{ marginBottom: 12 }}>
        <Text style={shared.label}>Mode</Text>
        <Text style={shared.body}>{sessionMode === 'guest' ? 'Guest demo · data stays on this device' : 'Account mode'}</Text>
      </View>

      <View style={{ marginBottom: 12 }}>
        <Text style={shared.label}>Search</Text>
        <Text style={shared.body}>{query || 'All places'}</Text>
      </View>

      <View style={{ marginBottom: 16 }}>
        <Button title="Search places" onPress={() => setQuery(query)} />
      </View>

      <Link href="/add-place" asChild>
        <Pressable style={StyleSheet.flatten([shared.action, { marginBottom: 16 }])}>
          <Text style={shared.actionText}>Add a place</Text>
        </Pressable>
      </Link>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={[shared.card, { gap: 8 }]}>
            <Text style={shared.sectionTitle}>{item.name}</Text>
            <Text style={shared.body}>{item.address}</Text>
            <Text style={shared.caption}>{item.category}</Text>
            {item.notes ? <Text style={shared.caption}>{item.notes}</Text> : null}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
              <Pressable onPress={() => void toggleVisited(item.id)}>
                <Text style={{ color: colors.green, fontWeight: '700' }}>{item.visited ? 'Mark unvisited' : 'Mark visited'}</Text>
              </Pressable>
              <Pressable onPress={() => {
                const url = buildGoogleMapsSearchUrl(item.name, item.address);
                void url;
              }}>
                <Text style={{ color: colors.orange, fontWeight: '700' }}>Map search</Text>
              </Pressable>
              <Pressable onPress={() => void removePlace(item.id)}>
                <Text style={{ color: colors.error, fontWeight: '700' }}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={shared.caption}>No matches or no saved places yet.</Text>}
      />
    </View>
  );
}
