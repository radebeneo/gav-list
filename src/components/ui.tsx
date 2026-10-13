import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';
import { colors as themeColors } from '../config/theme';

export const colors = {
  paper: themeColors.background,
  white: themeColors.card,
  ink: themeColors.foreground,
  muted: themeColors.mutedForeground,
  green: themeColors.primary,
  lime: themeColors.subscription,
  line: themeColors.border,
  orange: themeColors.accent,
  pale: themeColors.muted,
  error: themeColors.destructive,
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
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  body: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Poppins-Regular',
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
  },
  caption: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Poppins-Regular',
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
    fontFamily: 'Poppins-SemiBold',
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
    fontFamily: 'Poppins-Medium',
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
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
    fontFamily: 'Poppins-Bold',
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
