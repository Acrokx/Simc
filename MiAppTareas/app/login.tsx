import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import api from "./api";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value.trim());
  };

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert("Error", "Por favor ingresa correo y contraseña.");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      Alert.alert("Error", "Formato de correo inválido.");
      return;
    }

    if (trimmedPassword.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/login/", {
        correo: trimmedEmail.toLowerCase(),
        contraseña: trimmedPassword,
      }, {
        timeout: 10000,
      });

      if (response.data?.success) {
        router.replace("/home");
      } else {
        Alert.alert("Error", response.data?.message || "Credenciales incorrectas.");
        setLoading(false);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Error de conexión al servidor.';
      Alert.alert("Error de Conexión", message);
      console.error('Login error:', message, error);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0FDFB" />
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&h=1080&fit=crop' }} 
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.card}>
              <Text style={styles.heading}>Bienvenido</Text>
              <Text style={styles.subtitle}>Inicia sesión en SIMC</Text>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Correo electrónico</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="correo@ejemplo.com"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    value={email}
                    onChangeText={setEmail}
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="********"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    <Text style={styles.eyeText}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>{loading ? "Iniciando..." : "Iniciar Sesión"}</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0FDFB",
  },
  background: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(240, 253, 251, 0.88)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    shadowColor: "#0D7377",
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.2,
    shadowRadius: 35,
    elevation: 12,
    borderWidth: 1,
    borderColor: "rgba(13, 115, 119, 0.1)",
  },
  heading: {
    fontSize: 34,
    fontWeight: "800",
    color: "#0D7377",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#5A7D7C",
    marginBottom: 32,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D7377",
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: "#F0FDFB",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E0F2F1",
  },
  input: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#0F172A",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDFB",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E0F2F1",
  },
  passwordInput: {
    flex: 1,
    backgroundColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#0F172A",
  },
  eyeButton: {
    padding: 16,
  },
  eyeText: {
    fontSize: 20,
  },
  button: {
    backgroundColor: "#0D7377",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#0D7377",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: "#94A3B8",
    shadowOpacity: 0,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});