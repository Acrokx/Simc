import { useCallback, useEffect, useState } from "react";
import { Alert, Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import api, { setAuthHeaders } from "../../../services/api";
import { colors } from "../../../theme";
import { getItem } from "../../../lib/storage";
import { BottomNav } from "../../../components/ui/BottomNav";
import { ADMIN_BOTTOM_NAV } from "../../../components/navigation/AdminNavigation";
import { Sidebar } from "../../../components/layout/Sidebar";
import { Breadcrumb } from "../../../components/layout/Breadcrumb";

interface Agricultor {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  num_fincas: number;
  rol: string;
  bloqueado: boolean;
}

export default function UsuariosIndex() {
  const router = useRouter();
  const [agricultores, setAgricultores] = useState<Agricultor[]>([]);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [telefono, setTelefono] = useState("");
  const [selectedAgricultor, setSelectedAgricultor] = useState<Agricultor | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editApellido, setEditApellido] = useState("");
  const [editTelefono, setEditTelefono] = useState("");
  const [editRol, setEditRol] = useState("");
  const [bloqueandoId, setBloqueandoId] = useState<number | null>(null);
  const [rolInput, setRolInput] = useState("");
  const [rolModalVisible, setRolModalVisible] = useState(false);
  const [rolTargetId, setRolTargetId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Agricultor | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadAgricultores = useCallback(async () => {
    try {
      const response = await api.get("/usuarios/agricultores/");
      setAgricultores(response.data);
    } catch (error: any) {
      Alert.alert("Error", `No se pudieron cargar los agricultores.`);
    }
  }, []);

  useEffect(() => {
    loadAuthHeaders();
    loadAgricultores();
  }, [loadAgricultores]);

  const loadAuthHeaders = async () => {
    try {
      const userString = await getItem("userData");
      if (userString) {
        const storedUser = JSON.parse(userString);
        if (storedUser?.correo && storedUser?.password) {
          setAuthHeaders(storedUser);
        }
      }
    } catch {}
  };

  const handleCrearAgricultor = async () => {
    if (!nombre.trim() || !correo.trim() || !contraseña.trim()) {
      Alert.alert("Error", "Nombre, correo y contraseña son requeridos.");
      return;
    }
    try {
      await api.post("/usuarios/", { nombre, apellido, correo, contraseña, telefono, rol: "Agricultor" });
      Alert.alert("Éxito", "Agricultor creado correctamente.");
      setNombre(""); setApellido(""); setCorreo(""); setContraseña(""); setTelefono("");
      loadAgricultores();
    } catch {}
  };

  const openEdit = (ag: Agricultor) => {
    setSelectedAgricultor(ag);
    setEditNombre(ag.nombre);
    setEditApellido(ag.apellido);
    setEditTelefono(ag.telefono);
    setEditRol(ag.rol);
  };

  const handleSaveEdit = async () => {
    if (!selectedAgricultor) return;
    setSaving(true);
    try {
      await api.patch(`/usuarios/editar/${selectedAgricultor.id_usuario}/`, {
        nombre: editNombre.trim(),
        apellido: editApellido.trim(),
        telefono: editTelefono.trim(),
        rol: editRol || selectedAgricultor.rol,
      });
      Alert.alert("Éxito", "Usuario actualizado.");
      setSelectedAgricultor(null);
      loadAgricultores();
    } catch (error: any) {
      const data = error?.response?.data;
      const msg = typeof data === 'string' ? data : data?.error || JSON.stringify(data || error?.message || 'Error desconocido');
      Alert.alert('Error al actualizar', msg);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (ag: Agricultor) => {
    setDeleteTarget(ag);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      await api.delete(`/usuarios/eliminar/${deleteTarget.id_usuario}/`);
      Alert.alert("Éxito", "Usuario eliminado.");
      setDeleteTarget(null);
      loadAgricultores();
    } catch (error: any) {
      const data = error?.response?.data;
      const fallback = error?.message || 'Error desconocido';
      let msg = fallback;
      if (typeof data === 'string') {
        msg = data;
      } else if (data && typeof data === 'object') {
        const parts = [data.error, data.details, data.traceback].filter(Boolean);
        msg = parts.join('\n\n') || JSON.stringify(data);
      }
      console.error('Delete user failed:', { status: error?.response?.status, data, fallback, backendMessage: msg });
      Alert.alert('Error al eliminar', msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleBloqueo = async (ag: Agricultor) => {
    setBloqueandoId(ag.id_usuario);
    try {
      await api.post(`/usuarios/${ag.id_usuario}/bloquear/`);
      loadAgricultores();
    } catch {
      Alert.alert("Error", "No se pudo cambiar el estado.");
    } finally {
      setBloqueandoId(null);
    }
  };

  const openRolModal = (ag: Agricultor) => {
    setRolTargetId(ag.id_usuario);
    setRolInput(ag.rol);
    setRolModalVisible(true);
  };

  const handleChangeRole = async () => {
    if (!rolTargetId || !rolInput.trim()) return;
    try {
      await api.patch(`/usuarios/editar/${rolTargetId}/`, { rol: rolInput.trim() });
      Alert.alert("Éxito", "Rol actualizado.");
      setRolModalVisible(false);
      setRolTargetId(null);
      loadAgricultores();
    } catch {
      Alert.alert("Error", "No se pudo actualizar el rol.");
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Sidebar />
      <View style={styles.mainContent}>
        <Breadcrumb items={[
          { label: 'Dashboard', route: '/(admin)/dashboard' },
          { label: 'Gestión de Usuarios' },
        ]} />
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>👥</Text>
            <Text style={styles.headerTitle}>Gestión de Usuarios</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Crear Agricultor</Text>
            <View style={styles.fieldRow}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Nombre</Text>
                <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor={colors.text.muted} value={nombre} onChangeText={setNombre} />
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Apellido</Text>
                <TextInput style={styles.input} placeholder="Apellido" placeholderTextColor={colors.text.muted} value={apellido} onChangeText={setApellido} />
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Correo</Text>
              <TextInput style={styles.input} placeholder="correo@ejemplo.com" placeholderTextColor={colors.text.muted} keyboardType="email-address" value={correo} onChangeText={setCorreo} />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Contraseña</Text>
              <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor={colors.text.muted} secureTextEntry value={contraseña} onChangeText={setContraseña} />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Teléfono</Text>
              <TextInput style={styles.input} placeholder="Teléfono" placeholderTextColor={colors.text.muted} value={telefono} onChangeText={setTelefono} />
            </View>
            <TouchableOpacity style={styles.registerButton} onPress={handleCrearAgricultor}>
              <Text style={styles.registerButtonText}>Crear Agricultor</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Agricultores Registrados</Text>
            {agricultores.map((ag) => (
              <View key={ag.id_usuario} style={styles.userCard}>
                <Text style={styles.userName}>{ag.nombre} {ag.apellido}</Text>
                <Text style={styles.userDetail}>📧 {ag.correo}</Text>
                <Text style={styles.userDetail}>📱 {ag.telefono || 'Sin teléfono'}</Text>
                <Text style={styles.userDetail}>Rol: {ag.rol}</Text>
                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.editButton} onPress={() => openEdit(ag)}>
                    <Text style={styles.editButtonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.roleButton} onPress={() => openRolModal(ag)}>
                    <Text style={styles.roleButtonText}>Rol</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.blockButton, ag.bloqueado && styles.blockButtonActive]}
                    onPress={() => toggleBloqueo(ag)}
                    disabled={bloqueandoId === ag.id_usuario}
                  >
                    <Text style={styles.blockButtonText}>{ag.bloqueado ? 'Desbloquear' : 'Bloquear'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(ag)}>
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        <BottomNav items={ADMIN_BOTTOM_NAV} activeRoute="/(admin)/usuarios" onPress={(route) => router.push(route as any)} />
      </View>

      {/* Modal Editar */}
      <Modal visible={!!selectedAgricultor} animationType="slide" transparent onRequestClose={() => setSelectedAgricultor(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Usuario</Text>
            <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor={colors.text.muted} value={editNombre} onChangeText={setEditNombre} />
            <TextInput style={styles.input} placeholder="Apellido" placeholderTextColor={colors.text.muted} value={editApellido} onChangeText={setEditApellido} />
            <TextInput style={styles.input} placeholder="Teléfono" placeholderTextColor={colors.text.muted} value={editTelefono} onChangeText={setEditTelefono} />
            <TextInput style={styles.input} placeholder="Rol" placeholderTextColor={colors.text.muted} value={editRol} onChangeText={setEditRol} />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setSelectedAgricultor(null)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSaveEdit} disabled={saving}>
                <Text style={styles.saveButtonText}>{saving ? 'Guardando...' : 'Guardar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Confirmar Eliminación */}
      <Modal visible={!!deleteTarget} animationType="fade" transparent onRequestClose={() => setDeleteTarget(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Eliminar usuario</Text>
            <Text style={styles.modalMessage}>
              ¿Deseas eliminar a {deleteTarget?.nombre} {deleteTarget?.apellido}? Esta acción no se puede deshacer.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setDeleteTarget(null)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.deleteButtonModal]} onPress={handleDelete} disabled={loading}>
                <Text style={styles.deleteButtonModalText}>{loading ? 'Eliminando...' : 'Eliminar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Cambiar Rol */}
      <Modal visible={rolModalVisible} animationType="slide" transparent onRequestClose={() => setRolModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cambiar Rol</Text>
            <TextInput style={styles.input} placeholder="Rol" placeholderTextColor={colors.text.muted} value={rolInput} onChangeText={setRolInput} />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setRolModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleChangeRole}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, flexDirection: 'row', backgroundColor: '#F8FAFC' },
  mainContent: { flex: 1 },
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40, gap: 24 },
  header: { paddingTop: 16, gap: 4 },
  headerEmoji: { fontSize: 36 },
  headerTitle: { fontSize: 34, fontWeight: '800', color: colors.text.primary },
  formCard: { backgroundColor: colors.card, borderRadius: 24, padding: 24, gap: 16, borderWidth: 1, borderColor: colors.border },
  formTitle: { fontSize: 20, fontWeight: '700', color: colors.text.primary },
  fieldRow: { flexDirection: 'row', gap: 12 },
  fieldGroup: { gap: 8, marginBottom: 2, flex: 1 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: colors.text.secondary },
  input: { backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, paddingVertical: 14, paddingHorizontal: 16, fontSize: 16, color: colors.text.primary },
  registerButton: { backgroundColor: colors.primary, borderRadius: 18, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  registerButtonText: { color: colors.card, fontSize: 16, fontWeight: '700' },
  section: { gap: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: colors.text.primary },
  userCard: { backgroundColor: colors.card, borderRadius: 20, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: colors.border, gap: 6 },
  userName: { fontSize: 17, fontWeight: '700', color: colors.text.primary },
  userDetail: { fontSize: 14, color: colors.text.secondary },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 12, flexWrap: 'wrap' },
  editButton: { backgroundColor: colors.secondary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  editButtonText: { color: colors.card, fontWeight: '600' },
  roleButton: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  roleButtonText: { color: colors.card, fontWeight: '600' },
  blockButton: { backgroundColor: colors.warning, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  blockButtonActive: { backgroundColor: colors.success },
  blockButtonText: { color: colors.card, fontWeight: '600' },
  deleteButton: { backgroundColor: colors.error, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  deleteButtonText: { color: colors.card, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { width: '100%', backgroundColor: colors.card, borderRadius: 24, padding: 24, gap: 16 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.text.primary },
  modalMessage: { fontSize: 14, color: colors.text.secondary, lineHeight: 20 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  modalButton: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12 },
  cancelButton: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  cancelButtonText: { color: colors.text.primary, fontWeight: '700' },
  saveButton: { backgroundColor: colors.primary },
  saveButtonText: { color: colors.card, fontWeight: '700' },
  deleteButtonModal: { backgroundColor: colors.error },
  deleteButtonModalText: { color: colors.card, fontWeight: '700' },
});
