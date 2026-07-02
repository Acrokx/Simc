import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from '../../../theme';
import api from '../../../services/api';
import { getItem } from '../../../lib/storage';

export default function CrearFinca() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [tamaño, setTamaño] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await getItem('userData');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUserId(parsed.id_usuario || parsed.id || '');
        }
      } catch {}
    };
    loadUser();
  }, []);

  const [userId, setUserId] = useState('');

  const handleCrear = async () => {
    if (!nombre.trim() || !ubicacion.trim()) {
      Alert.alert('Error', 'Nombre y ubicación son requeridos.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/fincas/', {
        nombre_finca: nombre.trim(),
        ubicacion: ubicacion.trim(),
        tamaño_hectareas: parseFloat(tamaño) || 0,
        id_usuario: parseInt(userId) || undefined,
      });
      Alert.alert('Éxito', 'Finca creada correctamente.');
      router.replace('/(admin)/fincas');
    } catch {
      Alert.alert('Error', 'No se pudo crear la finca.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Finca</Text>
      <TextInput style={styles.input} placeholder="Nombre de la finca" placeholderTextColor={colors.text.muted} value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Ubicación" placeholderTextColor={colors.text.muted} value={ubicacion} onChangeText={setUbicacion} />
      <TextInput style={styles.input} placeholder="Tamaño (hectáreas)" placeholderTextColor={colors.text.muted} keyboardType="numeric" value={tamaño} onChangeText={setTamaño} />
      <TouchableOpacity style={styles.button} onPress={handleCrear}>
        <Text style={styles.buttonText}>Crear Finca</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, padding: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text.primary },
  input: { width: '100%', backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, paddingVertical: 14, paddingHorizontal: 16, fontSize: 16, color: colors.text.primary },
  button: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center', width: '100%' },
  buttonText: { color: colors.card, fontSize: 16, fontWeight: '700' },
  link: { color: colors.primary, fontSize: 14, fontWeight: '600', marginTop: 8 },
});
