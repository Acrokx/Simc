import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  style?: any;
}

export function Button({ title, onPress, variant = 'primary', disabled, style }: ButtonProps) {
  const bg = variant === 'primary' ? colors.primary : variant === 'danger' ? colors.error : colors.surface;
  const textColor = variant === 'secondary' ? colors.primary : colors.card;
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bg, opacity: disabled ? 0.6 : 1 }, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
