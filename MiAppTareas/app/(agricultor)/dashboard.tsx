import { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors } from "../../theme";
import { getItem, removeItem } from "../../lib/storage";
import { DashboardHeader, MetricCard, AlertCard, RecommendationCard, BarChart, SensorStatus } from "../../components/ui";
import { AGRICULTOR_BOTTOM_NAV } from "../../components/navigation/FarmerNavigation";
import { BottomNav } from "../../components/ui/BottomNav";

interface UserData {
  nombre: string;
  apellido: string;
  rol: string;
}

interface DashboardData {
  num_fincas: number;
  num_cultivos: number;
  num_sensores: number;
  sensores_activos: number;
  sensores_inactivos: number;
  num_alertas_activas: number;
  num_alertas_criticas: number;
  mediciones_count: number;
  promedio_humedad: number | null;
  ultima_medicion: { valor: number; sensor: string; fecha: string } | null;
}

interface SensorItem {
  id_sensor: number;
  tipo_sensor: string;
  estado: string;
  activo: boolean;
}

interface MedicionItem {
  id_medicion: number;
  valor_humedad: number;
  fecha_medicion: string;
}

export default function AgricultorDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [alertas, setAlertas] = useState<any[]>([]);
  const [sensores, setSensores] = useState<SensorItem[]>([]);
  const [mediciones, setMediciones] = useState<MedicionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const handleNavPress = (route: string) => {
    router.push(route as any);
  };

  const handleLogout = async () => {
    await removeItem("userData");
    router.replace("/(auth)/login");
  };

  const formatDate = (fecha: string) => {
    const d = new Date(fecha);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return "Hace menos de 1h";
    if (diffHours < 24) return `Hace ${diffHours}h`;
    return d.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
  };

  useEffect(() => {
    const init = async () => {
      try {
        const stored = await getItem("userData");
        if (stored) {
          const user = JSON.parse(stored) as UserData;
          setUserData(user);
        } else {
          router.replace("/(auth)/login");
          return;
        }
      } catch {
        router.replace("/(auth)/login");
        return;
      }
      setLoading(false);
    };
    init();
  }, [router]);

  useEffect(() => {
    if (!userData) return;

    const loadDashboard = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/dashboard/");
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      } catch {
        // offline mode
      }
    };

    const loadAlertas = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/alertas/?leida=false&limit=3");
        const data = await response.json();
        setAlertas(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch {
        // offline mode
      }
    };

    const loadSensores = async () => {
      try {
        const response = await api.get("/sensores/");
        setSensores(Array.isArray(response.data) ? response.data : []);
      } catch {
        // offline mode
      }
    };

    const loadMediciones = async () => {
      try {
        const response = await api.get("/mediciones/");
        setMediciones(Array.isArray(response.data) ? response.data.slice(0, 12) : []);
      } catch {
        // offline mode
      }
    };

    loadDashboard();
    loadAlertas();
    loadSensores();
    loadMediciones();
  }, [userData]);

  const alertasParaMostrar = alertas.length > 0 ? alertas : [
    { tipo_alerta: "Humedad baja", descripcion: "Sensor S-03 reportó humedad del 28% en el sector norte.", fecha_alerta: new Date().toISOString(), prioridad: "media" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <DashboardHeader
        userName={userData?.nombre || "Agricultor"}
        farmName="Mi Finca"
        notificationCount={stats?.num_alertas_activas ?? alertas.length}
        role="Agricultor"
        onMenuPress={() => {}}
        onNotificationPress={() => router.push("/(agricultor)/alertas")}
      />

      <View style={styles.logoutRow}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutLabel}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sensores en Tiempo Real</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              icon="💧"
              label="Humedad del suelo"
              value={stats?.promedio_humedad ? String(stats.promedio_humedad) : "72"}
              unit="%"
              status={stats?.promedio_humedad && stats.promedio_humedad < 30 ? "Bajo" : "Óptimo"}
              progress={stats?.promedio_humedad ? Number(stats.promedio_humedad) : 72}
              showProgress
            />
            <MetricCard
              icon="🌡️"
              label="Temperatura"
              value="24.6"
              unit="°C"
              status="Normal"
              progress={55}
              showProgress
            />
            <MetricCard
              icon="💦"
              label="Nivel de agua"
              value="85"
              unit="%"
              status="Alto"
              progress={85}
              showProgress
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{stats?.num_fincas ?? 1}</Text>
              <Text style={styles.summaryLabel}>Fincas</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{stats?.num_cultivos ?? 3}</Text>
              <Text style={styles.summaryLabel}>Cultivos</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{stats?.num_sensores ?? 5}</Text>
              <Text style={styles.summaryLabel}>Sensores</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{stats?.num_alertas_activas ?? alertas.length}</Text>
              <Text style={styles.summaryLabel}>Alertas</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado de Sensores</Text>
          <SensorStatus sensores={sensores} />
        </View>

        {mediciones.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tendencia de Humedad</Text>
            <BarChart
              data={mediciones.map(m => m.valor_humedad)}
              height={160}
              color={colors.primary}
              labels={mediciones.map(m => new Date(m.fecha_medicion).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }))}
            />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alertas Recientes</Text>
          {alertasParaMostrar.map((alerta, index) => (
            <AlertCard
              key={alerta.id_alerta ?? index}
              title={alerta.tipo_alerta}
              description={alerta.descripcion}
              date={alerta.fecha_alerta ? formatDate(alerta.fecha_alerta) : ""}
              type={alerta.prioridad === "alta" || alerta.prioridad === "critica" ? "error" : alerta.prioridad === "media" ? "warning" : "info"}
              onPress={() => router.push("/(agricultor)/alertas")}
            />
          ))}
        </View>

        <View style={styles.section}>
          <RecommendationCard
            message="Se recomienda verificar los sensores de humedad. Los niveles se encuentran dentro del rango adecuado."
            actionLabel="Ver sensores"
            onAction={() => router.push("/(agricultor)/sensores")}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNav items={AGRICULTOR_BOTTOM_NAV} activeRoute="/(agricultor)/dashboard" onPress={handleNavPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingBottom: 120,
    gap: 24,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 8,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    minWidth: "40%",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text.primary,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: "600",
    textAlign: "center",
  },
  logoutRow: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoutIcon: {
    fontSize: 18,
    color: colors.text.primary,
  },
  logoutLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.primary,
    letterSpacing: 0.2,
  },
});
