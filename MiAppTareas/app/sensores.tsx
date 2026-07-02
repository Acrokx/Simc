import { useEffect, useState } from "react";
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import api from "./api";

interface Cultivo {
  id_cultivo: number;
  tipo_cultivo: string;
}

interface Sensor {
  id_sensor: number;
  tipo_sensor: string;
  ubicacion: string;
  estado: string;
  id_cultivo: number;
}

interface SensorMeasurement {
  id: number;
  sensor: string;
  valor: number;
  unidad: string;
  fecha: string;
  ubicacion: string;
}

export default function Sensores() {
  const router = useRouter();
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [tipo, setTipo] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [estado, setEstado] = useState("Activo");
  const [cultivoSeleccionado, setCultivoSeleccionado] = useState<number | null>(null);
  const [mediciones, setMediciones] = useState<SensorMeasurement[]>([]);

  useEffect(() => {
    loadSensores();
    loadCultivos();
  }, []);

  const loadSensores = async () => {
    try {
      const response = await api.get('/sensores/');
      setSensores(response.data);
    } catch (error) {
      console.error('Error loading sensores:', error);
    }
  };

  const loadCultivos = async () => {
    try {
      const response = await api.get('/cultivos/');
      setCultivos(response.data);
    } catch (error) {
      console.error('Error loading cultivos:', error);
    }
  };

  const handleRegister = async () => {
    if (!tipo.trim() || !ubicacion.trim() || !cultivoSeleccionado) {
      Alert.alert("Error", "Tipo, ubicación y cultivo son requeridos.");
      return;
    }

    try {
      await api.post('/sensores/', {
        tipo_sensor: tipo,
        ubicacion,
        estado,
        id_cultivo: cultivoSeleccionado,
      });
      Alert.alert("Éxito", "Sensor registrado correctamente.");
      setTipo("");
      setUbicacion("");
      setEstado("Activo");
      setCultivoSeleccionado(null);
      loadSensores();
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Error desconocido';
      Alert.alert("Error", `No se pudo registrar el sensor. ${message}`);
      console.error('Sensor registration error:', message, error);
    }
  };

  const simulateMediciones = () => {
    const source = sensores.length > 0 ? sensores : [
      { id_sensor: 1, tipo_sensor: 'Humedad del suelo', ubicacion: 'Simulado', estado: 'Activo', id_cultivo: 0 },
      { id_sensor: 2, tipo_sensor: 'Temperatura ambiente', ubicacion: 'Simulado', estado: 'Activo', id_cultivo: 0 },
      { id_sensor: 3, tipo_sensor: 'Luz', ubicacion: 'Simulado', estado: 'Activo', id_cultivo: 0 },
    ];

    const values = source.map((sensor, index) => ({
      id: index + 1,
      sensor: sensor.tipo_sensor,
      valor: parseFloat((Math.random() * 60 + 20).toFixed(1)),
      unidad: sensor.tipo_sensor.toLowerCase().includes('temperatura') ? '°C' : sensor.tipo_sensor.toLowerCase().includes('humedad') ? '%' : 'lx',
      fecha: new Date().toLocaleString(),
      ubicacion: sensor.ubicacion,
    }));

    setMediciones(values);
    Alert.alert('Simulación', 'Se generaron mediciones de sensores simuladas.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0FDFB" />
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Sensores</Text>
        <Text style={styles.subtitle}>Registra sensores para monitorear tus cultivos.</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Tipo de sensor</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ej: Humedad del suelo"
              value={tipo}
              onChangeText={setTipo}
            />
          </View>

          <Text style={styles.label}>Ubicación</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ej: Sector Norte"
              value={ubicacion}
              onChangeText={setUbicacion}
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

          <Text style={styles.label}>Seleccionar cultivo</Text>
          {cultivos.map((cultivo) => (
            <TouchableOpacity
              key={cultivo.id_cultivo}
              style={[
                styles.cultivoOption,
                cultivoSeleccionado === cultivo.id_cultivo && styles.cultivoSelected,
              ]}
              onPress={() => setCultivoSeleccionado(cultivo.id_cultivo)}
            >
              <Text style={styles.cultivoText}>{cultivo.tipo_cultivo}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrar Sensor</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.simulateButton} onPress={simulateMediciones}>
            <Text style={styles.simulateButtonText}>Simular Mediciones</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Sensores Registrados</Text>
        {sensores.length === 0 ? (
          <Text style={styles.emptyText}>No hay sensores registrados aún.</Text>
        ) : (
          sensores.map((sensor) => (
            <View key={sensor.id_sensor} style={styles.card}>
              <Text style={styles.cardTitle}>{sensor.tipo_sensor}</Text>
              <Text style={styles.cardText}>Ubicación: {sensor.ubicacion}</Text>
              <Text style={styles.cardText}>Estado: {sensor.estado}</Text>
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Mediciones Simuladas</Text>
        {mediciones.length === 0 ? (
          <Text style={styles.emptyText}>Pulsa el botón de simular mediciones para generar datos de sensores.</Text>
        ) : (
          mediciones.map((medicion) => (
            <View key={medicion.id} style={styles.card}>
              <Text style={styles.cardTitle}>{medicion.sensor}</Text>
              <Text style={styles.cardText}>Valor: {medicion.valor} {medicion.unidad}</Text>
              <Text style={styles.cardText}>Ubicación: {medicion.ubicacion}</Text>
              <Text style={styles.cardText}>Fecha: {medicion.fecha}</Text>
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
  cultivoOption: {
    backgroundColor: "#F0FDFB",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#E0F2F1",
  },
  cultivoSelected: {
    backgroundColor: "#E0F7F5",
    borderColor: "#0D7377",
  },
  cultivoText: {
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
  simulateButton: {
    backgroundColor: "#14A095",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 2,
    borderColor: "rgba(20, 160, 149, 0.3)",
  },
  simulateButtonText: {
    color: "#0D7377",
    fontSize: 15,
    fontWeight: "700",
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