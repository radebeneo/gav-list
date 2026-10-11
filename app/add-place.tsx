import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Field, Message, shared } from '../src/components/ui';
import { PLACE_CATEGORIES, type PlaceInput } from '../src/lib/places';
import { useApp } from '../src/providers/app-provider';

export default function AddPlaceScreen() {
  const { addPlace } = useApp();
  const [form, setForm] = useState<PlaceInput>({
    name: '',
    address: '',
    notes: '',
    category: 'Other',
    visited: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const updateField = (field: keyof PlaceInput, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async () => {
    try {
      setSaving(true);
      setError(null);
      await addPlace(form);
      router.back();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'The place could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
      <Text style={shared.title}>Add a place</Text>
      <Field label="Name" value={form.name} onChangeText={(value) => updateField('name', value)} placeholder="Golden Canyon" />
      <Field label="Address" value={form.address} onChangeText={(value) => updateField('address', value)} placeholder="Red Rock, Las Vegas" />
      <Field label="Notes" value={form.notes ?? ''} onChangeText={(value) => updateField('notes', value)} placeholder="Optional details" multiline />

      <View style={{ gap: 8 }}>
        <Text style={shared.label}>Category</Text>
        <Text style={shared.body}>{form.category}</Text>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {PLACE_CATEGORIES.map((category) => (
          <Button
            key={category}
            title={category}
            onPress={() => updateField('category', category)}
          />
        ))}
      </View>

      {error ? <Message text={error} kind="error" /> : null}
      <Button title={saving ? 'Saving…' : 'Save place'} onPress={() => void submit()} />
    </ScrollView>
  );
}
