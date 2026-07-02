import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import api from "./api";

interface Finca {
  id?: number;
  id_finca: number;
  nombre_finca: string;
  ubicacion: string;
  tamaño_hectareas: string;
  descripcion: string;
  id_usuario?: number;
}

interface Agricultor {
  id_usuario: number;
  nombre: string;
  apellido: string;
}

const getFincaId = (finca: Finca | null): number | null => {
  if (!finca) return null;
  return finca.id ?? finca.id_finca ?? null;
};

export default function Fincas() {
  const router = useRouter();
  const [fincas, setFincas] = useState<Finca[]>([]);
  const [agricultores, setAgricultores] = useState<Agricultor[]>([]);
  const [selectedAgricultor, setSelectedAgricultor] = useState<Agricultor | null>(null);
  const [selectedFinca, setSelectedFinca] = useState<Finca | null>(null);
  const [savingFinca, setSavingFinca] = useState(false);
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [tamaño, setTamaño] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editFincaNombre, setEditFincaNombre] = useState("");
  const [editFincaUbicacion, setEditFincaUbicacion] = useState("");
  const [editFincaTamaño, setEditFincaTamaño] = useState("");
  const [editFincaDescripcion, setEditFincaDescripcion] = useState("");

  const loadFincas = useCallback(async () => {
    try {
      const response = await api.get('/fincas/');
      setFincas(response.data.map((finca: any) => ({
        ...finca,
        id: finca.id ?? finca.id_finca,
      })));
    } catch (error) {
      console.error('Error loading fincas:', error);
      Alert.alert('Error', 'No se pudieron cargar las fincas. Revisa la conexión.');
    }
  }, []);

  const loadAgricultores = useCallback(async () => {
    try {
      const response = await api.get('/usuarios/agricultores/');
      setAgricultores(response.data);
      if (response.data.length > 0) {
        setSelectedAgricultor(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading agricultores:', error);
    }
  }, []);

  useEffect(() => {
    loadFincas();
    loadAgricultores();
  }, [loadFincas, loadAgricultores]);

  const handleCrearFinca = async () => {
    if (!nombre.trim() || !ubicacion.trim() || !selectedAgricultor) {
      Alert.alert("Error", "Agricultor, nombre y ubicación son requeridos.");
      return;
    }

    const tamañoValor = tamaño.trim() !== '' ? Number(tamaño) : 0;

    setSavingFinca(true);
    try {
      const response = await api.post('/fincas/', {
        nombre_finca: nombre,
        ubicacion,
        tamaño_hectareas: Number.isFinite(tamañoValor) ? tamañoValor : 0,
        descripcion,
        id_usuario: selectedAgricultor.id_usuario,
      });
      const nuevaFinca = {
        ...response.data,
        id: response.data.id ?? response.data.id_finca,
      };
      setFincas((prev) => [nuevaFinca, ...prev]);
      Alert.alert("Éxito", "Finca creada correctamente.");
      setNombre("");
      setUbicacion("");
      setTamaño("");
      setDescripcion("");
    } catch (error: any) {
      const message = error?.response?.data?.error || error?.message || 'Error desconocido';
      Alert.alert("Error", `No se pudo crear la finca. ${message}`);
    } finally {
      setSavingFinca(false);
    }
  };

  const confirmCrearFinca = () => {
    if (!nombre.trim() || !ubicacion.trim()) {
      Alert.alert("Error", "Nombre y ubicación son requeridos.");
      return;
    }

    Alert.alert(
      'Crear finca',
      `¿Deseas crear la finca "${nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Crear', onPress: handleCrearFinca },
      ]
    );
  };

  const eliminarFinca = async (id: number, nombreFinca: string) => {
    try {
      await api.delete(`/fincas/${id}/`);
      setFincas((prev) => prev.filter((item) => getFincaId(item) !== id));
      if (getFincaId(selectedFinca) === id) {
        setSelectedFinca(null);
        setEditFincaNombre(""); setEditFincaUbicacion(""); setEditFincaTamaño(""); setEditFincaDescripcion("");
      }
      Alert.alert("Éxito", `Finca "${nombreFinca}" eliminada.`);
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Error desconocido';
      Alert.alert("Error", `No se pudo eliminar la finca. ${message}`);
    }
  };

  const handleEliminarFinca = (finca: Finca | null) => {
    if (!finca) {
      Alert.alert('Error', 'No se pudo identificar la finca a eliminar.');
      return;
    }

    const fincaId = getFincaId(finca);
    if (!fincaId) {
      Alert.alert('Error', 'No se pudo identificar la finca a eliminar.');
      return;
    }

    Alert.alert(
      'Eliminar finca',
      `¿Eliminar la finca "${finca.nombre_finca}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => eliminarFinca(fincaId, finca.nombre_finca) },
      ]
    );
  };

  const handleEditarFinca = async () => {
    if (!selectedFinca) return;

    const fincaId = getFincaId(selectedFinca);
    if (!fincaId) {
      Alert.alert('Error', 'No se pudo identificar la finca a editar.');
      return;
    }

    setSavingFinca(true);
    try {
      const tamañoValor = editFincaTamaño.trim() !== '' ? Number(editFincaTamaño) : Number(selectedFinca.tamaño_hectareas);
      const response = await api.put(`/fincas/${fincaId}/`, {
        nombre_finca: editFincaNombre || selectedFinca.nombre_finca,
        ubicacion: editFincaUbicacion || selectedFinca.ubicacion,
        tamaño_hectareas: Number.isFinite(tamañoValor) ? tamañoValor : Number(selectedFinca.tamaño_hectareas),
        descripcion: editFincaDescripcion || selectedFinca.descripcion,
        id_usuario: selectedFinca.id_usuario,
      });
      const fincaActualizada = {
        ...response.data,
        id: response.data.id ?? response.data.id_finca ?? fincaId,
      };
      setFincas((prev) => prev.map((item) => getFincaId(item) === fincaId ? fincaActualizada : item));
      Alert.alert("Éxito", "Finca actualizada.");
      setSelectedFinca(null);
      setEditFincaNombre(""); setEditFincaUbicacion(""); setEditFincaTamaño(""); setEditFincaDescripcion("");
    } catch (error: any) {
      const message = error?.response?.data?.error || error?.message || 'Error';
      Alert.alert("Error", `No se pudo editar la finca. ${message}`);
    } finally {
      setSavingFinca(false);
    }
  };

  const confirmEditarFinca = () => {
    if (!selectedFinca) return;

    Alert.alert(
      'Confirmar edición',
      '¿Estás seguro de guardar los cambios en esta finca?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Guardar', style: 'default', onPress: handleEditarFinca },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0FDFB" />
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Fincas</Text>
        <Text style={styles.subtitle}>Registra y consulta tus fincas.</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Agricultor</Text>
          {agricultores.length === 0 ? (
            <Text style={styles.infoText}>Cargando agricultores...</Text>
          ) : (
            <View style={styles.agricultorList}>
              {agricultores.map((ag) => (
                <TouchableOpacity
                  key={ag.id_usuario}
                  style={[
                    styles.agricultorOption,
                    selectedAgricultor?.id_usuario === ag.id_usuario && styles.agricultorSelected,
                  ]}
                  onPress={() => setSelectedAgricultor(ag)}
                >
                  <Text style={styles.agricultorText}>{ag.nombre} {ag.apellido}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.label}>Nombre de la finca</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ej: Finca El Paraíso"
              value={nombre}
              onChangeText={setNombre}
            />
          </View>

          <Text style={styles.label}>Ubicación</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ej: Mosquera, Cundinamarca"
              value={ubicacion}
              onChangeText={setUbicacion}
            />
          </View>

          <Text style={styles.label}>Tamaño (hectáreas)</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ej: 5.5"
              keyboardType="numeric"
              value={tamaño}
              onChangeText={setTamaño}
            />
          </View>

          <Text style={styles.label}>Descripción (opcional)</Text>
          <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descripción de la finca"
              multiline
              value={descripcion}
              onChangeText={setDescripcion}
            />
          </View>

          <TouchableOpacity style={[styles.button, savingFinca && styles.buttonDisabled]} onPress={confirmCrearFinca} disabled={savingFinca}>
            <Text style={styles.buttonText}>{savingFinca ? 'Guardando...' : 'Crear Finca'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Fincas Registradas</Text>
        {fincas.length === 0 ? (
          <Text style={styles.emptyText}>No hay fincas registradas aún.</Text>
        ) : (
          fincas.map((finca) => (
            <View key={getFincaId(finca)} style={styles.card}>
              <Text style={styles.cardTitle}>{finca.nombre_finca}</Text>
              <Text style={styles.cardText}>Ubicación: {finca.ubicacion}</Text>
              <Text style={styles.cardText}>Tamaño: {finca.tamaño_hectareas} ha</Text>
              {finca.descripcion && (
                <Text style={styles.cardText}>Descripción: {finca.descripcion}</Text>
              )}
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    setSelectedFinca(finca);
                    setEditFincaNombre(finca.nombre_finca);
                    setEditFincaUbicacion(finca.ubicacion);
                    setEditFincaTamaño(String(finca.tamaño_hectareas));
                    setEditFincaDescripcion(finca.descripcion || "");
                  }}
                >
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleEliminarFinca(finca)}
                >
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {selectedFinca && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Editar Finca</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={editFincaNombre}
              onChangeText={setEditFincaNombre}
            />
            <TextInput
              style={styles.input}
              placeholder="Ubicación"
              value={editFincaUbicacion}
              onChangeText={setEditFincaUbicacion}
            />
            <TextInput
              style={styles.input}
              placeholder="Tamaño"
              keyboardType="numeric"
              value={editFincaTamaño}
              onChangeText={setEditFincaTamaño}
            />
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              value={editFincaDescripcion}
              onChangeText={setEditFincaDescripcion}
            />
            <View style={styles.row}>
              <TouchableOpacity style={[styles.button, savingFinca && styles.buttonDisabled]} onPress={confirmEditarFinca} disabled={savingFinca}>
                <Text style={styles.buttonText}>{savingFinca ? 'Guardando...' : 'Guardar'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => {
                setSelectedFinca(null);
                setEditFincaNombre(""); setEditFincaUbicacion(""); setEditFincaTamaño(""); setEditFincaDescripcion("");
              }}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    fontSize: 32,
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
    lineHeight: 22,
  },
  form: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#0D7377",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(13, 115, 119, 0.1)",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D7377",
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: "#F0FDFB",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#E0F2F1",
  },
  input: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#0F172A",
  },
  textAreaWrapper: {
    borderRadius: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#0D7377",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#0D7377",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
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
  agricultorList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  agricultorOption: {
    backgroundColor: "#F0FDFB",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#E0F2F1",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    marginRight: 8,
  },
  agricultorSelected: {
    borderColor: "#0D7377",
    backgroundColor: "#E0FDFB",
  },
  agricultorText: {
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "600",
  },
  infoText: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0D7377",
    marginBottom: 16,
    marginTop: 8,
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
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
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