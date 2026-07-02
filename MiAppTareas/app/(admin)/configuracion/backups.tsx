import { useEffect, useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from "../../../theme";
import api from "../../../services/api";
import { Sidebar } from "../../../components/layout/Sidebar";
import { Breadcrumb } from "../../../components/layout/Breadcrumb";
import { BottomNav } from "../../../components/ui/BottomNav";
import { ADMIN_BOTTOM_NAV } from "../../../components/navigation/AdminNavigation";

export default function Backups() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const downloadCsv = async (url: string, filename: string) => {
    setLoading(true);
    try {
      const response = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      downloadBlob(blob, filename);
      Alert.alert('Éxito', 'Archivo descargado correctamente.');
    } catch (error: any) {
      const data = error?.response?.data;
      const msg = typeof data === 'string' ? data : data?.error || 'No se pudo generar el archivo.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    setLoading(true);
    try {
      await api.post('/configuracion/backup/', {});
      Alert.alert('Éxito', 'Backup generado correctamente.');
    } catch {
      Alert.alert('Error', 'No se pudo generar el backup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Sidebar />
      <View style={styles.mainContent}>
        <Breadcrumb items={[
          { label: 'Dashboard', route: '/(admin)/dashboard' },
          { label: 'Configuración', route: '/(admin)/configuracion/sistema' },
          { label: 'Backups' },
        ]} />
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Copias de Seguridad</Text>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Backup</Text>
            <TouchableOpacity style={styles.button} onPress={handleBackup} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Generando...' : 'Generar Backup'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exportar datos</Text>
            <View style={styles.exportGrid}>
              <TouchableOpacity style={styles.exportButton} onPress={() => downloadCsv('/configuracion/reporte-alertas-excel/', 'reporte_alertas.csv')}>
                <Text style={styles.exportIcon}>🚨</Text>
                <Text style={styles.exportTitle}>Alertas</Text>
                <Text style={styles.exportSub}>CSV</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.exportButton} onPress={() => downloadCsv('/configuracion/reporte-mediciones-csv/', 'reporte_mediciones.csv')}>
                <Text style={styles.exportIcon}>💧</Text>
                <Text style={styles.exportTitle}>Mediciones</Text>
                <Text style={styles.exportSub}>CSV</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.exportButton} onPress={() => downloadCsv('/configuracion/reporte-sensores-csv/', 'reporte_sensores.csv')}>
                <Text style={styles.exportIcon}>📡</Text>
                <Text style={styles.exportTitle}>Sensores</Text>
                <Text style={styles.exportSub}>CSV</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.exportButton} onPress={() => downloadCsv('/configuracion/reporte-cultivos-csv/', 'reporte_cultivos.csv')}>
                <Text style={styles.exportIcon}>🌱</Text>
                <Text style={styles.exportTitle}>Cultivos</Text>
                <Text style={styles.exportSub}>CSV</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <BottomNav items={ADMIN_BOTTOM_NAV} activeRoute="/(admin)/configuracion/sistema" onPress={(r) => router.push(r as any)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, flexDirection: 'row', backgroundColor: '#F8FAFC' },
  mainContent: { flex: 1 },
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120, gap: 24 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text.primary },
  section: { gap: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: colors.text.primary },
  button: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center', width: '100%' },
  buttonText: { color: colors.card, fontSize: 16, fontWeight: '700' },
  exportGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  exportButton: { width: '47%', backgroundColor: colors.card, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.border, alignItems: 'center', gap: 6 },
  exportIcon: { fontSize: 26 },
  exportTitle: { fontSize: 15, fontWeight: '700', color: colors.text.primary },
  exportSub: { fontSize: 12, color: colors.text.secondary, fontWeight: '600' },
});
