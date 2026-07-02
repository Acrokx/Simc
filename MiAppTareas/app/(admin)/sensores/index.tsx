import { useEffect, useState } from "react";
import { Alert, Animated, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../../theme";
import api from "../../../services/api";
import { getItem } from "../../../lib/storage";
import { BottomNav } from "../../../components/ui/BottomNav";
import { ADMIN_BOTTOM_NAV } from "../../../components/navigation/AdminNavigation";
import { Sidebar } from "../../../components/layout/Sidebar";
import { Breadcrumb } from "../../../components/layout/Breadcrumb";

interface Cultivo { id_cultivo: number; tipo_cultivo: string; }
interface Sensor { id_sensor: number; codigo_sensor?: string; tipo_sensor: string; ubicacion: string; estado: string; id_cultivo: number; }

const SENSOR_TYPES = [{ label: "Humedad del suelo", unidad: "%", rango: [20, 85] }, { label: "Temperatura ambiente", unidad: "°C", rango: [10, 40] }];

function getTendencia(prev: number, curr: number): "up" | "down" | "stable" {
  if (curr > prev + 0.5) return "up";
  if (curr < prev - 0.5) return "down";
  return "stable";
}

export default function SensoresScreen() {
    const router = useRouter();
    const [sensores, setSensores] = useState<Sensor[]>([]);
    const [cultivos, setCultivos] = useState<Cultivo[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [readings, setReadings] = useState<any[]>([]);
    const intervalRef = useState<ReturnType<typeof setInterval> | null>(null)[1];

    const handleNavPress = (route: string) => router.push(route as any);

    useEffect(() => {
        const init = async () => {
            const userString = await getItem("userData");
            const user = userString ? JSON.parse(userString) : null;
            setCurrentUser(user);
            loadSensores();
            loadCultivos();
        };
        init();
    }, []);

    const loadSensores = async () => {
        try { const response = await api.get("/sensores/"); setSensores(response.data); }
        catch (error) { console.error("Error loading sensores:", error); }
    };

    const loadCultivos = async () => {
        try { const response = await api.get("/cultivos/"); setCultivos(response.data); }
        catch (error) { console.error("Error loading cultivos:", error); }
    };

    const isFarmer = currentUser?.rol?.toLowerCase() === "agricultor";

    return (
        <View style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
            <Sidebar />
            <View style={styles.mainContent}>
                <Breadcrumb items={[{ label: 'Dashboard', route: '/(admin)/dashboard' }, { label: 'Gestión de Sensores' }]} />
                <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>📡 Sensores</Text>
                        <Text style={styles.headerSubtitle}>Monitorea tus sensores agrícolas</Text>
                    </View>

                    {sensores.length === 0 ? (
                        <Text style={styles.emptyText}>No hay sensores registrados.</Text>
                    ) : sensores.map((sensor) => (
                        <View key={sensor.id_sensor} style={styles.sensorCard}>
                            <Text style={styles.sensorName}>{sensor.codigo_sensor || sensor.tipo_sensor}</Text>
                            <Text style={styles.sensorDetail}>Ubicación: {sensor.ubicacion}</Text>
                        </View>
                    ))}
                </ScrollView>
                <BottomNav items={ADMIN_BOTTOM_NAV} activeRoute="/(admin)/sensores" onPress={handleNavPress} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, flexDirection: 'row', backgroundColor: '#F8FAFC' },
    mainContent: { flex: 1 },
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    scrollContent: { flexGrow: 1, padding: 24, paddingTop: 20, paddingBottom: 120 },
    header: { paddingTop: 16, gap: 4, paddingHorizontal: 24 },
    headerTitle: { fontSize: 28, fontWeight: "800" as const, color: colors.text.primary },
    headerSubtitle: { fontSize: 15, color: colors.text.secondary, marginTop: 4 },
    sensorCard: {
        backgroundColor: colors.card,
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    sensorName: { fontSize: 17, fontWeight: "700" as const, color: colors.primary },
    sensorDetail: { fontSize: 14, color: colors.text.secondary, marginTop: 4 },
    emptyText: { fontSize: 15, color: colors.text.secondary, textAlign: "center" as const, marginVertical: 20 },
});