import { useEffect, useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from "../../../theme";
import api, { setAuthHeaders } from "../../../services/api";
import { getItem } from "../../../lib/storage";
import { downloadBlob } from "../../../lib/download";
import { Sidebar } from "../../../components/layout/Sidebar";
import { Breadcrumb } from "../../../components/layout/Breadcrumb";
import { BottomNav } from "../../../components/ui/BottomNav";
import { ADMIN_BOTTOM_NAV } from "../../../components/navigation/AdminNavigation";

export default function ReportesPdf() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await api.get('/configuracion/reporte-alertas-pdf/', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      downloadBlob(blob, 'reporte_alertas.pdf');
      Alert.alert('Éxito', 'Reporte PDF descargado correctamente.');
    } catch (error: any) {
      const data = error?.response?.data;
      const msg = typeof data === 'string' ? data : data?.error || 'No se pudo generar el reporte PDF.';
      Alert.alert('Error', msg);
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
          { label: 'Reportes', route: '/(admin)/reportes' },
          { label: 'PDF' },
        ]} />
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Exportar PDF</Text>
          <TouchableOpacity style={styles.button} onPress={handleGenerate} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Generando...' : 'Generar Reporte PDF'}</Text>
          </TouchableOpacity>
        </ScrollView>
        <BottomNav items={ADMIN_BOTTOM_NAV} activeRoute="/(admin)/reportes" onPress={(r) => router.push(r as any)} />
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
  button: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center', width: '100%' },
  buttonText: { color: colors.card, fontSize: 16, fontWeight: '700' },
});
