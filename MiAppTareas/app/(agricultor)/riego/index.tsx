import { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../../theme";
import api from "../../../services/api";
import { getItem } from "../../../lib/storage";
import { MetricCard, AlertCard, RecommendationCard } from "../../components/ui";
import { AGRICULTOR_BOTTOM_NAV } from "../../../components/navigation/FarmerNavigation";
import { BottomNav } from "../../../components/ui/BottomNav";

interface RiegoRegistro {
  id_riego: number;
  fecha_riego: string;
  cantidad_agua: number;
  id_cultivo: number;
}

export default function RiegoScreen() {
  const router = useRouter();
  const [riegos, setRiegos] = useState<RiegoRegistro[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHistorial = async () => {
    try {
      const response = await api.get("/riegos/");
      setRiegos(Array.isArray(response.data) ? response.data : []);
    } catch {
      // offline mode
    }
  };

  const handleActivarRiego = async () => {
    setLoading(true);
    try {
      await api.post("/riegos/", {
        fecha_riego: new Date().toISOString().split("T")[0],
        cantidad_agua: 50,
        id_cultivo: 1,
      });
      Alert.alert("Éxito", "Riego activado correctamente.");
      loadHistorial();
    } catch {
      Alert.alert("Error", "No se pudo activar el riego.");
    } finally {
      setLoading(false);
    }
  };

  const handleDetenerRiego = async () => {
    setLoading(true);
    try {
      const last = riegos[0];
      if (!last) {
        Alert.alert("Info", "No hay un riego activo para detener.");
        setLoading(false);
        return;
      }
      await api.patch(`/riegos/${last.id_riego}/`, {
        cantidad_agua: Math.max(0, (last.cantidad_agua || 0) - 5),
      });
      Alert.alert("Éxito", "Riego detenido correctamente.");
      loadHistorial();
    } catch {
      Alert.alert("Error", "No se pudo detener el riego.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>💧</Text>
          <Text style={styles.headerTitle}>Control de Riego</Text>
          <Text style={styles.headerSubtitle}>Gestiona el riego de tus cultivos</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={handleActivarRiego} disabled={loading}>
            <Text style={styles.actionIcon}>🚿</Text>
            <Text style={styles.actionLabel}>{loading ? "Activando..." : "Activar riego"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]} onPress={handleDetenerRiego} disabled={loading}>
            <Text style={styles.actionIcon}>🛑</Text>
            <Text style={styles.actionLabel}>{loading ? "Deteniendo..." : "Detener riego"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historial de riegos</Text>
          {riegos.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyText}>No hay registros de riego.</Text>
            </View>
          ) : (
            riegos.map((riego) => (
              <View key={riego.id_riego} style={styles.riegoCard}>
                <View style={styles.riegoLeft}>
                  <Text style={styles.riegoIcon}>💧</Text>
                  <View>
                    <Text style={styles.riegoTitle}>Cultivo #{riego.id_cultivo}</Text>
                    <Text style={styles.riegoDate}>{riego.fecha_riego}</Text>
                  </View>
                </View>
                <View style={styles.riegoRight}>
                  <Text style={styles.riegoValue}>{riego.cantidad_agua}L</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      <BottomNav items={AGRICULTOR_BOTTOM_NAV} activeRoute="/(agricultor)/riego" onPress={(r) => router.push(r as any)} />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120, gap: 24 },
  header: { paddingTop: 16, gap: 4 },
  headerEmoji: { fontSize: 36 },
  headerTitle: { fontSize: 34, fontWeight: "800", color: colors.text.primary, letterSpacing: -1 },
  headerSubtitle: { fontSize: 15, color: colors.text.secondary, fontWeight: "500" },
  actionsRow: { flexDirection: "row", gap: 12 },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    gap: 8,
  },
  actionButtonSecondary: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: { fontSize: 26 },
  actionLabel: { fontSize: 14, fontWeight: "700", color: colors.card },
  section: { gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.text.primary },
  riegoCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  riegoLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  riegoIcon: { fontSize: 24 },
  riegoTitle: { fontSize: 15, fontWeight: "700", color: colors.text.primary },
  riegoDate: { fontSize: 12, color: colors.text.secondary },
  riegoRight: { backgroundColor: colors.successBg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  riegoValue: { color: colors.secondary, fontSize: 14, fontWeight: "700" },
  emptyCard: { backgroundColor: colors.card, borderRadius: 24, padding: 36, alignItems: "center", gap: 10, borderWidth: 1, borderColor: colors.border },
  emptyEmoji: { fontSize: 44 },
  emptyText: { fontSize: 15, color: colors.text.secondary, textAlign: "center" },
});
