import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme';

interface ModalProps {
  visible: boolean;
  title?: string;
  onClose?: () => void;
  children?: React.ReactNode;
}

export function Modal({ visible, title, onClose, children }: ModalProps) {
  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        {title && <Text style={styles.title}>{title}</Text>}
        <View style={styles.body}>{children}</View>
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Cerrar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modal: { backgroundColor: colors.card, borderRadius: 24, padding: 24, width: '100%', maxWidth: 400, gap: 16 },
  title: { fontSize: 20, fontWeight: '800', color: colors.text.primary },
  body: { gap: 12 },
  closeButton: { backgroundColor: colors.surface, paddingVertical: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  closeText: { color: colors.text.primary, fontWeight: '600' },
});
