import { useEffect, useState } from "react";
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors } from "../../../theme";
import { getItem, setItem, removeItem } from "../../../lib/storage";
import { AGRICULTOR_BOTTOM_NAV } from "../../../components/navigation/FarmerNavigation";
import { BottomNav } from "../../../components/ui/BottomNav";

type UserData = {
  nombre?: string;
  apellido?: string;
  correo?: string;
  telefono?: string;
  rol?: string;
};

export default function AgricultorPerfil() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>({});
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await getItem("userData");
        if (!stored) {
          router.replace("/(auth)/login");
          return;
        }
        const parsed = JSON.parse(stored) as UserData;
        setUserData(parsed);
        setNombre(parsed.nombre ?? "");
        setApellido(parsed.apellido ?? "");
        setCorreo(parsed.correo ?? "");
        setTelefono(parsed.telefono ?? "");
        setPassword(parsed.password ?? "");
      } catch (error) {
        console.warn("Error cargando perfil:", error);
      }
    };
    loadUser();
  }, [router]);

  const handleSave = async () => {
    if (!nombre.trim() || !apellido.trim() || !correo.trim()) {
      Alert.alert("Error", "Nombre, apellido y correo son requeridos.");
      return;
    }

    try {
      const updatedUser = { ...userData, nombre: nombre.trim(), apellido: apellido.trim(), correo: correo.trim(), telefono: telefono.trim(), password: password.trim() || userData.password };
      await setItem("userData", JSON.stringify(updatedUser));
      setUserData(updatedUser);
      setIsEditing(false);
      Alert.alert("Éxito", "Perfil actualizado correctamente.");
    } catch (error) {
      console.error("Error guardando perfil:", error);
      Alert.alert("Error", "No se pudo actualizar el perfil.");
    }
  };

  const handleLogout = async () => {
    await removeItem("userData");
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.userName}>{userData.nombre || "Usuario"} {userData.apellido || ""}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📝 Información Personal</Text>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Text style={styles.editBtn}>{isEditing ? "✕ Cancelar" : "✏️ Editar"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Nombre</Text>
            <TextInput style={[styles.input, !isEditing && styles.inputDisabled]} value={nombre} onChangeText={setNombre} editable={isEditing} />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Apellido</Text>
            <TextInput style={[styles.input, !isEditing && styles.inputDisabled]} value={apellido} onChangeText={setApellido} editable={isEditing} />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>📧 Correo electrónico</Text>
            <TextInput style={[styles.input, !isEditing && styles.inputDisabled]} value={correo} onChangeText={setCorreo} keyboardType="email-address" editable={isEditing} />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>📱 Teléfono</Text>
            <TextInput style={[styles.input, !isEditing && styles.inputDisabled]} value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" editable={isEditing} />
          </View>
        </View>

        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>💾 Guardar cambios</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🚪 Cerrar sesión</Text>
        </TouchableOpacity>

        <BottomNav items={AGRICULTOR_BOTTOM_NAV} activeRoute="/(agricultor)/perfil" onPress={(route) => router.replace(route)} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { paddingHorizontal: 24, paddingBottom: 40, gap: 24 },
  header: { alignItems: 'center', paddingTop: 16, gap: 10 },
  userName: { fontSize: 22, fontWeight: '800', color: colors.text.primary },
  card: { backgroundColor: colors.card, borderRadius: 24, padding: 24, gap: 16, borderWidth: 1, borderColor: colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.text.primary },
  editBtn: { fontSize: 14, fontWeight: '600', color: colors.primary },
  fieldGroup: { gap: 8 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: colors.text.secondary, textTransform: 'uppercase' },
  input: { backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, paddingVertical: 14, paddingHorizontal: 16, fontSize: 16, color: colors.text.primary },
  inputDisabled: { backgroundColor: colors.background, color: colors.text.primary },
  saveButton: { backgroundColor: colors.primary, borderRadius: 18, paddingVertical: 16, alignItems: 'center' },
  saveButtonText: { color: colors.card, fontSize: 16, fontWeight: '700' },
  logoutButton: { backgroundColor: colors.error, borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  logoutButtonText: { color: colors.card, fontSize: 15, fontWeight: '700' },
});