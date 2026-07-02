import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from "../../theme";
import api from '../../services/api';

export default function RecuperarPassword() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');

  const handleRecuperar = async () => {
    if (!correo.trim()) {
      Alert.alert('Error', 'Ingresa tu correo electrónico.');
      return;
    }
    try {
      await api.post('/recuperar-password/', { correo: correo.trim() });
      Alert.alert('Éxito', 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña.');
      router.replace('/(auth)/login');
    } catch {
      Alert.alert('Error', 'No se pudo procesar la solicitud. Intenta más tarde.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar contraseña</Text>
      <Text style={styles.subtitle}>Ingresa tu correo y te enviaremos las instrucciones.</Text>
      <TextInput
        style={styles.input}
        placeholder="correo@ejemplo.com"
        placeholderTextColor={colors.text.muted}
        keyboardType="email-address"
        autoCapitalize="none"
        value={correo}
        onChangeText={setCorreo}
      />
      <TouchableOpacity style={styles.button} onPress={handleRecuperar}>
        <Text style={styles.buttonText}>Enviar instrucciones</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
        <Text style={styles.link}>Volver al inicio de sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text.primary,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '700',
  },
  link: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
