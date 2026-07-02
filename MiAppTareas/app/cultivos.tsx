import { useEffect, useState } from "react";
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import api from "./api";

interface Finca {
  id_finca: number;
  nombre_finca: string;
}

interface Cultivo {
  id_cultivo: number;
  tipo_cultivo: string;
  fecha_siembra: string;
  estado: string;
  id_finca: number;
}

export default function Cultivos() {
  const router = useRouter();
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [fincas, setFincas] = useState<Finca[]>([]);
  const [tipo, setTipo] = useState("");
  const [fecha, setFecha] = useState("");
  const [estado, setEstado] = useState("Activo");
  const [fincaSeleccionada, setFincaSeleccionada] = useState<number | null>(null);

  useEffect(() => {
    loadCultivos();
    loadFincas();
  }, []);

  const loadCultivos = async () => {
    try {
      const response = await api.get('/cultivos/');
      setCultivos(response.data);
    } catch (error) {
      console.error('Error loading cultivos:', error);
    }
  };

  const loadFincas = async () => {
    try {
      const response = await api.get('/fincas/');
      setFincas(response.data);
    } catch (error) {
      console.error('Error loading fincas:', error);
    }
  };

  const handleRegister = async () => {
    if (!tipo.trim() || !fecha.trim() || !fincaSeleccionada) {
      Alert.alert("Error", "Tipo, fecha y finca son requeridos.");
      return;
    }

    try {
      await api.post('/cultivos/', {
        tipo_cultivo: tipo,
        fecha_siembra: fecha,
        estado,
        id_finca: fincaSeleccionada,
      });
      Alert.alert("Éxito", "Cultivo registrado correctamente.");
      setTipo("");
      setFecha("");
      setEstado("Activo");
      setFincaSeleccionada(null);
      loadCultivos();
    } catch (error) {
      Alert.alert("Error", "No se pudo registrar el cultivo.");
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0FDFB" />
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Cultivos</Text>
        <Text style={styles.subtitle}>Registra y consulta cultivos en tus fincas.</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Tipo de cultivo</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ej: Maíz, Tomate"
              value={tipo}
              onChangeText={setTipo}
            />
          </View>

          <Text style={styles.label}>Fecha de siembra (YYYY-MM-DD)</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ej: 2026-05-06"
              value={fecha}
              onChangeText={setFecha}
            />
          </View>

          <Text style={styles.label}>Estado</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ej: Activo"
              value={estado}
              onChangeText={setEstado}
            />
          </View>

          <Text style={styles.label}>Seleccionar finca</Text>
          {fincas.map((finca) => (
            <TouchableOpacity
              key={finca.id_finca}
              style={[
                styles.fincaOption,
                fincaSeleccionada === finca.id_finca && styles.fincaSelected,
              ]}
              onPress={() => setFincaSeleccionada(finca.id_finca)}
            >
              <Text style={styles.fincaText}>{finca.nombre_finca}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrar Cultivo</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Cultivos Registrados</Text>
        {cultivos.length === 0 ? (
          <Text style={styles.emptyText}>No hay cultivos registrados aún.</Text>
        ) : (
          cultivos.map((cultivo) => (
            <View key={cultivo.id_cultivo} style={styles.card}>
              <Text style={styles.cardTitle}>{cultivo.tipo_cultivo}</Text>
              <Text style={styles.cardText}>Fecha siembra: {cultivo.fecha_siembra}</Text>
              <Text style={styles.cardText}>Estado: {cultivo.estado}</Text>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0FDFB",
  },
  container: {
    flex: 1,
    padding: 24,
  },
  heading: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0D7377",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#5A7D7C",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#0D7377",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(13, 115, 119, 0.1)",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D7377",
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: "#F0FDFB",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#E0F2F1",
  },
  input: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#0F172A",
  },
  fincaOption: {
    backgroundColor: "#F0FDFB",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#E0F2F1",
  },
  fincaSelected: {
    backgroundColor: "#E0F7F5",
    borderColor: "#0D7377",
  },
  fincaText: {
    fontSize: 16,
    color: "#0F172A",
  },
  button: {
    backgroundColor: "#0D7377",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#0D7377",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0D7377",
    marginBottom: 16,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#0D7377",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(13, 115, 119, 0.08)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0D7377",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 15,
    color: "#5A7D7C",
    lineHeight: 22,
    marginBottom: 4,
  },
  backButton: {
    backgroundColor: "#0D7377",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 24,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});