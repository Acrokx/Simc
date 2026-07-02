import { useEffect, useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from "../../../theme";
import api from "../../../services/api";
import { Sidebar } from "../../../components/layout/Sidebar";
import { Breadcrumb } from "../../../components/layout/Breadcrumb";
import { BottomNav } from "../../../components/ui/BottomNav";
import { ADMIN_BOTTOM_NAV } from "../../../components/navigation/AdminNavigation";

interface ConfigItem {
  clave: string;
  valor: string;
  descripcion: string;
  actualizado_en: string;
}

export default function ConfiguracionCorreos() {
  const router = useRouter();
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const res = await api.get('/configuracion/sistema/');
      const data: ConfigItem[] = Array.isArray(res.data) ? res.data : [];
      const getVal = (key: string) => data.find(c => c.clave === key)?.valor || '';
      setSmtpHost(getVal('smtp_host'));
      setSmtpPort(getVal('smtp_port'));
      setSmtpUser(getVal('smtp_user'));
      setSmtpPass(getVal('smtp_password'));
      setFromEmail(getVal('email_from'));
    } catch (e) {
      console.error('Error loading email config:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const saveKey = async (clave: string, valor: string) => {
    try {
      await api.put(`/configuracion/sistema/${encodeURIComponent(clave)}/`, { valor });
    } catch {
      console.error(`Error saving ${clave}`);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        saveKey('smtp_host', smtpHost),
        saveKey('smtp_port', smtpPort),
        saveKey('smtp_user', smtpUser),
        saveKey('smtp_password', smtpPass),
        saveKey('email_from', fromEmail),
      ]);
      Alert.alert('Éxito', 'Configuración de correos guardada.');
    } catch {
      Alert.alert('Error', 'No se pudo guardar la configuración.');
    } finally {
      setSaving(false);
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
          { label: 'Correos Electrónicos' },
        ]} />
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Configuración de Correos</Text>
          <View style={styles.formCard}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Servidor SMTP</Text>
              <TextInput style={styles.input} placeholder="smtp.ejemplo.com" placeholderTextColor={colors.text.muted} value={smtpHost} onChangeText={setSmtpHost} />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Puerto SMTP</Text>
              <TextInput style={styles.input} placeholder="587" placeholderTextColor={colors.text.muted} keyboardType="numeric" value={smtpPort} onChangeText={setSmtpPort} />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Usuario SMTP</Text>
              <TextInput style={styles.input} placeholder="correo@dominio.com" placeholderTextColor={colors.text.muted} value={smtpUser} onChangeText={setSmtpUser} />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Contraseña SMTP</Text>
              <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={colors.text.muted} secureTextEntry value={smtpPass} onChangeText={setSmtpPass} />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Correo remitente (From)</Text>
              <TextInput style={styles.input} placeholder="no-reply@dominio.com" placeholderTextColor={colors.text.muted} value={fromEmail} onChangeText={setFromEmail} />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
              <Text style={styles.saveButtonText}>{saving ? 'Guardando...' : 'Guardar Configuración'}</Text>
            </TouchableOpacity>
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
  formCard: { backgroundColor: colors.card, borderRadius: 24, padding: 24, gap: 16, borderWidth: 1, borderColor: colors.border },
  fieldGroup: { gap: 8 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: colors.text.secondary, textTransform: 'uppercase' },
  input: { backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, paddingVertical: 14, paddingHorizontal: 16, fontSize: 16, color: colors.text.primary },
  saveButton: { backgroundColor: colors.primary, borderRadius: 18, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  saveButtonText: { color: colors.card, fontSize: 16, fontWeight: '700' },
});
