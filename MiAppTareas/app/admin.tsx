import { useEffect, useState } from "react";
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import api from "./api";

interface Agricultor {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  num_fincas: number;
}

export default function Admin() {
  const router = useRouter();
  const [agricultores, setAgricultores] = useState<Agricultor[]>([]);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [telefono, setTelefono] = useState("");
  const [selectedAgricultor, setSelectedAgricultor] = useState<Agricultor | null>(null);

  useEffect(() => {
    loadAgricultores();
  }, []);

  const loadAgricultores = async () => {
    try {
      const response = await api.get('/usuarios/agricultores/');
      setAgricultores(response.data);
    } catch {
      Alert.alert("Error", "No se pudieron cargar los agricultores.");
    }
  };

  const handleCrearAgricultor = async () => {
    if (!nombre.trim() || !correo.trim() || !contraseña.trim()) {
      Alert.alert("Error", "Nombre, correo y contraseña son requeridos.");
      return;
    }

    Alert.alert(
      "Confirmar",
      "¿Crear agricultor?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Crear",
          style: "default",
          onPress: async () => {
            try {
              await api.post('/usuarios/registro/', {
                nombre,
                apellido,
                correo,
                contraseña,
                telefono,
                rol: 'Agricultor',
              });
              Alert.alert("Éxito", "Agricultor creado correctamente.");
              setNombre(""); setApellido(""); setCorreo(""); setContraseña(""); setTelefono("");
              loadAgricultores();
            } catch (error: any) {
              const message = error?.response?.data?.error || error?.message || 'Error desconocido';
              Alert.alert("Error", `No se pudo crear el agricultor. ${message}`);
            }
          },
        },
      ]
    );
  };

  const handleEditarAgricultor = async () => {
    if (!selectedAgricultor) return;

    try {
      await api.put(`/usuarios/editar/${selectedAgricultor.id_usuario}/`, {
        nombre: nombre || selectedAgricultor.nombre,
        apellido: apellido !== null ? apellido : selectedAgricultor.apellido,
        telefono: telefono !== null ? telefono : selectedAgricultor.telefono,
        contraseña: contraseña || undefined
      });
      Alert.alert("Éxito", "Agricultor actualizado correctamente.");
      setSelectedAgricultor(null);
      setNombre(""); setApellido(""); setCorreo(""); setContraseña(""); setTelefono("");
      loadAgricultores();
    } catch (error: any) {
      const message = error?.response?.data?.error || error?.message || 'Error desconocido';
      Alert.alert("Error", `No se pudo editar el agricultor. ${message}`);
    }
  };

  const handleEliminarAgricultor = async (id: number) => {
    Alert.alert(
      "Confirmar",
      "¿Estás seguro de eliminar este agricultor?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/usuarios/eliminar/${id}/`);
              Alert.alert("Éxito", "Agricultor eliminado.");
              loadAgricultores();
            } catch {
              Alert.alert("Error", "No se pudo eliminar el agricultor.");
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0FDFB" />
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Administración</Text>
        <Text style={styles.subtitle}>Gestión de agricultores y fincas</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Crear/Editar Agricultor</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
          />
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            value={apellido}
            onChangeText={setApellido}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo"
            keyboardType="email-address"
            value={correo}
            onChangeText={setCorreo}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={contraseña}
            onChangeText={setContraseña}
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
          />

          {selectedAgricultor ? (
            <View style={styles.row}>
              <TouchableOpacity style={styles.button} onPress={handleEditarAgricultor}>
                <Text style={styles.buttonText}>Actualizar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => {
                setSelectedAgricultor(null);
                setNombre(""); setApellido(""); setCorreo(""); setContraseña(""); setTelefono("");
              }}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleCrearAgricultor}>
              <Text style={styles.buttonText}>Crear Agricultor</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.sectionTitle}>Agricultores Registrados</Text>
        {agricultores.length === 0 ? (
          <Text style={styles.emptyText}>No hay agricultores registrados.</Text>
        ) : (
          agricultores.map((ag) => (
            <View key={ag.id_usuario} style={styles.card}>
              <Text style={styles.cardTitle}>{ag.nombre} {ag.apellido}</Text>
              <Text style={styles.cardText}>Correo: {ag.correo}</Text>
              <Text style={styles.cardText}>Teléfono: {ag.telefono || 'N/A'}</Text>
              <Text style={styles.cardText}>Fincas: {ag.num_fincas}</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    setSelectedAgricultor(ag);
                    setNombre(ag.nombre);
                    setApellido(ag.apellido);
                    setCorreo(ag.correo);
                    setTelefono(ag.telefono || "");
                  }}
                >
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleEliminarAgricultor(ag.id_usuario)}
                >
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0FDFB",
  },
  container: {
    flex: 1,
    padding: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0D7377",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#5A7D7C",
    marginBottom: 24,
    textAlign: "center",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#0D7377",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(13, 115, 119, 0.1)",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0D7377",
    marginBottom: 16,
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D7377",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F0FDFB",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#E0F2F1",
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#0F172A",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#0D7377",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#94A3B8",
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    backgroundColor: "#6B7280",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginLeft: 12,
    flex: 1,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    marginTop: 8,
  },
  fincaOption: {
    backgroundColor: "#F0FDFB",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#E0F2F1",
  },
  fincaSelected: {
    backgroundColor: "#E0F7F5",
    borderColor: "#0D7377",
  },
  fincaText: {
    fontSize: 16,
    color: "#0F172A",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#0D7377",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(13, 115, 119, 0.08)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0D7377",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 15,
    color: "#5A7D7C",
    lineHeight: 22,
    marginBottom: 4,
  },
  cardActions: {
    flexDirection: "row",
    marginTop: 12,
  },
  editButton: {
    backgroundColor: "#14A095",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 8,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: "#0D7377",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 24,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});