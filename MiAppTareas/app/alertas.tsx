import { useEffect, useState } from "react";
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import api from "./api";

interface Alerta {
  id_alerta: number;
  tipo_alerta: string;
  descripcion: string;
  fecha_alerta: string;
  prioridad: string;
  leida: boolean;
}

export default function Alertas() {
  const router = useRouter();
  const [alertas, setAlertas] = useState<Alerta[]>([]);

  useEffect(() => {
    loadAlertas();
  }, []);

  const loadAlertas = async () => {
    try {
      const response = await api.get('/alertas/');
      setAlertas(response.data);
    } catch (error) {
      console.error('Error loading alertas:', error);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.patch(`/alertas/${id}/`, { leida: true });
      loadAlertas();
    } catch (error) {
      console.error('Error marking alerta as read:', error);
    }
  };

  const generateSampleAlert = () => {
    Alert.alert("Simulación", "En un sistema real, aquí se generarían alertas basadas en lecturas de sensores.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0FDFB" />
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Alertas</Text>
        <Text style={styles.subtitle}>Revisa alertas del sistema y notificaciones importantes.</Text>

        <TouchableOpacity style={styles.generateButton} onPress={generateSampleAlert}>
          <Text style={styles.generateButtonText}>Simular Alerta</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Alertas Recientes</Text>
        {alertas.length === 0 ? (
          <Text style={styles.emptyText}>No hay alertas registradas aún.</Text>
        ) : (
          alertas.map((alerta) => (
            <View key={alerta.id_alerta} style={[styles.card, alerta.leida && styles.cardRead]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{alerta.tipo_alerta}</Text>
                <Text style={[styles.priority, alerta.prioridad === 'alta' && styles.priorityHigh]}>
                  {alerta.prioridad}
                </Text>
              </View>
              <Text style={styles.cardText}>{alerta.descripcion}</Text>
              <Text style={styles.cardDate}>{new Date(alerta.fecha_alerta).toLocaleString()}</Text>
              {!alerta.leida && (
                <TouchableOpacity
                  style={styles.markReadButton}
                  onPress={() => markAsRead(alerta.id_alerta)}
                >
                  <Text style={styles.markReadText}>Marcar como leída</Text>
                </TouchableOpacity>
              )}
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
  generateButton: {
    backgroundColor: "#14A095",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#0D7377",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0D7377",
    marginBottom: 16,
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
  cardRead: {
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0D7377",
  },
  priority: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
  },
  priorityHigh: {
    color: "#DC2626",
  },
  cardText: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 12,
  },
  markReadButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#E0F2F1",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  markReadText: {
    fontSize: 14,
    color: "#0D7377",
    fontWeight: "600",
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