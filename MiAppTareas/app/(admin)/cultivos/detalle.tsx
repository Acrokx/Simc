import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../../theme';
import api from '../../../services/api';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Breadcrumb } from '../../../components/layout/Breadcrumb';
import { BottomNav } from '../../../components/ui/BottomNav';
import { ADMIN_BOTTOM_NAV } from '../../../components/navigation/AdminNavigation';

export default function DetalleCultivo() {
  const router = useRouter();
  const [cultivo, setCultivo] = useState<any>(null);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Sidebar />
      <View style={styles.mainContent}>
        <Breadcrumb items={[
          { label: 'Dashboard', route: '/(admin)/dashboard' },
          { label: 'Cultivos', route: '/(admin)/cultivos' },
          { label: 'Detalle' },
        ]} />
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Detalle de Cultivo</Text>
          <Text style={styles.subtitle}>En construcción.</Text>
        </ScrollView>
        <BottomNav items={ADMIN_BOTTOM_NAV} activeRoute="/(admin)/cultivos" onPress={(r) => router.push(r as any)} />
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
  subtitle: { fontSize: 14, color: colors.text.secondary },
});
