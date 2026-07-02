import { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../../theme";
import api from "../../../services/api";
import { getItem } from "../../../lib/storage";
import { AlertCard, RecommendationCard } from "../../components/ui";
import { AGRICULTOR_BOTTOM_NAV } from "../../../components/navigation/FarmerNavigation";
import { BottomNav } from "../../../components/ui/BottomNav";

interface Notificacion {
  id: number;
  titulo: string;
  mensaje: string;
  leida: boolean;
  fecha: string;
}

export default function NotificacionesScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Notificacion[]>([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/alertas/?leida=false");
        const alertas = Array.isArray(res.data) ? res.data : [];
        setUnread(alertas.length);
        setItems(
          alertas.map((a: any, idx: number) => ({
            id: a.id_alerta ?? idx,
            titulo: a.tipo_alerta,
            mensaje: a.descripcion,
            leida: a.leida,
            fecha: a.fecha_alerta,
          }))
        );
      } catch {
        setItems([
          { id: 1, titulo: "Humedad baja", mensaje: "Sensor S-03 reportó humedad del 28% en el sector norte.", leida: false, fecha: new Date().toISOString() },
          { id: 2, titulo: "Riego completado", mensaje: "Se completó el riego del cultivo de Tomate.", leida: true, fecha: new Date(Date.now() - 86400000).toISOString() },
        ]);
        setUnread(1);
      }
    };
    load();
  }, []);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>🔔</Text>
          <Text style={styles.headerTitle}>Notificaciones</Text>
          <Text style={styles.headerSubtitle}>{unread} sin leer</Text>
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🔕</Text>
            <Text style={styles.emptyTitle}>Sin notificaciones</Text>
            <Text style={styles.emptyText}>Te avisaremos cuando haya novedades.</Text>
          </View>
        ) : (
          items.map((n) => (
            <View key={n.id} style={[styles.notifCard, !n.leida && styles.notifUnread]}>
              <View style={styles.notifIcon}>
                <Text style={styles.notifIconText}>{n.leida ? "🔕" : "🔔"}</Text>
              </View>
              <View style={styles.notifBody}>
                <Text style={styles.notifTitle}>{n.titulo}</Text>
                <Text style={styles.notifMessage}>{n.mensaje}</Text>
                <Text style={styles.notifDate}>{new Date(n.fecha).toLocaleString("es-CO")}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <BottomNav items={AGRICULTOR_BOTTOM_NAV} activeRoute="/(agricultor)/notificaciones" onPress={(r) => router.push(r as any)} />
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
  notifCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notifUnread: {
    borderColor: colors.primary,
    backgroundColor: colors.successBg,
  },
  notifIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  notifIconText: { fontSize: 20 },
  notifBody: { flex: 1 },
  notifTitle: { fontSize: 15, fontWeight: "700", color: colors.text.primary, marginBottom: 4 },
  notifMessage: { fontSize: 14, color: colors.text.secondary, lineHeight: 20, marginBottom: 6 },
  notifDate: { fontSize: 12, color: colors.text.muted, fontWeight: "500" },
  emptyCard: { backgroundColor: colors.card, borderRadius: 24, padding: 36, alignItems: "center", gap: 10, borderWidth: 1, borderColor: colors.border },
  emptyEmoji: { fontSize: 44 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: colors.text.primary },
  emptyText: { fontSize: 15, color: colors.text.secondary, textAlign: "center" },
});
