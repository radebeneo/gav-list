import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';

export const colors = {
  paper: '#F7F4EC',
  white: '#FFFFFF',
  ink: '#203B30',
  muted: '#64736A',
  green: '#244F3D',
  lime: '#DCEAAB',
  line: '#DCDDD2',
  orange: '#B45732',
  pale: '#E9EDDF',
  error: '#9D3329',
};

export const shared = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
    padding: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
  },
  label: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  body: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 22,
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Georgia',
  },
  caption: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  action: {
    backgroundColor: colors.green,
    borderRadius: 14,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  actionText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    borderRadius: 12,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.ink,
    fontSize: 16,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Georgia',
  },
});

export function Brand({ title = 'Gav List' }: { title?: string }) {
  return <Text style={styles.brand}>{title}</Text>;
}

export function Button({ title, onPress, disabled }: { title: string; onPress?: () => void; disabled?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[shared.action, disabled && styles.disabled]}>
      <Text style={shared.actionText}>{title}</Text>
    </Pressable>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={shared.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={[shared.input, multiline && { minHeight: 100, textAlignVertical: 'top' }]}
      />
    </View>
  );
}

export function Message({ text, kind = 'info' }: { text: string; kind?: 'info' | 'error' | 'success' }) {
  const palette =
    kind === 'error'
      ? { backgroundColor: '#FCE8E4', borderColor: colors.error }
      : kind === 'success'
        ? { backgroundColor: '#EDF8E9', borderColor: colors.green }
        : { backgroundColor: colors.pale, borderColor: colors.line };

  return (
    <View style={[styles.message, palette]}>
      <Text style={{ color: kind === 'error' ? colors.error : colors.ink }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: {
    color: colors.green,
    fontSize: 30,
    fontFamily: 'Georgia',
    fontWeight: '700',
    marginBottom: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  message: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
