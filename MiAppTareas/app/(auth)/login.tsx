import { useEffect, useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Animated, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";
import api from "../../services/api";
import { colors } from "../../theme";
import { setItem, getItem } from "../../lib/storage";

export default function Login() {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value.trim());
  };

  const checkPasswordStrength = (pwd: string): "weak" | "fair" | "strong" => {
    if (pwd.length < 6) return "weak";
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) return "strong";
    if (pwd.length >= 6) return "fair";
    return "weak";
  };

  const isLocked = lockUntil ? Date.now() < lockUntil : false;
  const lockRemaining = lockUntil ? Math.ceil((lockUntil - Date.now()) / 1000) : 0;

  const handleLogin = async () => {
    if (isLocked) {
      Alert.alert("Cuenta bloqueada", `Demasiados intentos fallidos. Inténtalo en ${lockRemaining}s.`);
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      Alert.alert("Atención", "Ingresa tu correo electrónico.");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      Alert.alert("Correo inválido", "Formato: usuario@dominio.com");
      return;
    }

    if (!trimmedPassword) {
      Alert.alert("Atención", "Ingresa tu contraseña.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/login/", {
        correo: trimmedEmail.toLowerCase(),
        contraseña: trimmedPassword,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Credenciales incorrectas.");
      }

      const userData = response.data.usuario;
      if (!userData) {
        throw new Error("Respuesta inválida del servidor.");
      }

      const userDataToSave = { ...userData, correo: trimmedEmail, password: trimmedPassword };
      if (rememberMe) {
        await setItem("rememberMe", "true");
      } else {
        await setItem("rememberMe", "false");
      }
      await setItem("userData", JSON.stringify(userDataToSave));
      setFailedAttempts(0);
      const userRol = (userData.rol || "").toLowerCase();
      if (userRol === "administrador") {
        router.replace("/(admin)/dashboard");
      } else {
        router.replace("/(agricultor)/dashboard");
      }
    } catch (error: any) {
      const status = error?.response?.status;
      const isAuthError = status === 401;

      if (isAuthError) {
        setFailedAttempts(prev => prev + 1);
        if (failedAttempts + 1 >= 5) {
          setLockUntil(Date.now() + 30000);
          Alert.alert("Cuenta bloqueada", "5 intentos fallidos. Bloqueado 30 segundos.");
        } else {
          const remaining = 5 - (failedAttempts + 1);
          Alert.alert("Error", `Credenciales incorrectas. ${remaining} intentos restantes.`);
        }
      } else {
        let message = "No se pudo conectar al servidor. Verifica que el backend esté ejecutándose y que el celular esté en la misma red Wi-Fi.";
        const errorMessage = String(error?.message || "").toLowerCase();
        if (errorMessage.includes('timeout') || errorMessage.includes('conn aborted') || errorMessage.includes('timeout de conexión')) {
          message = 'Tiempo de espera agotado. Comprueba que el servidor esté activo y que la red funcione.';
        } else if (errorMessage.includes('network error') || errorMessage.includes('failed to fetch')) {
          message = 'No se pudo conectar al servidor. Revisa la dirección IP del backend y la conexión de red.';
        } else if (error?.response?.data?.message) {
          message = error.response.data.message;
        } else if (error?.message) {
          message = error.message;
        }
        Alert.alert('Error de conexión', message);
      }
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
     Animated.parallel([
       Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
       Animated.spring(scaleAnim, { toValue: 1, tension: 40, friction: 8, useNativeDriver: true }),
     ]).start();

     if (pathname === '/(auth)/login') {
       const checkExistingSession = async () => {
         const userString = await getItem("userData");
         if (userString) {
           const user = JSON.parse(userString);
           const userRol = (user.rol || "").toLowerCase();
           if (userRol === "administrador") {
             router.replace("/(admin)/dashboard");
           } else {
             router.replace("/(agricultor)/dashboard");
           }
         }
       };
       checkExistingSession();
     }

     const loadRememberedSession = async () => {
       const saved = await getItem("rememberMe");
       if (saved === "true") setRememberMe(true);
     };
     loadRememberedSession();
   }, [fadeAnim, pathname, router, scaleAnim]);

  const handleForgotPassword = () => {
    Alert.alert("Recuperar contraseña", "Contacta al administrador del sistema para restablecer tu contraseña.");
  };

  const passwordStrength = checkPasswordStrength(password);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.backgroundContainer}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1500382800860-a57b2f6e64ab?w=1920&h=1080&fit=crop&q=80" }}
          style={styles.backgroundImage}
          contentFit="cover"
        />
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
              <View style={styles.logoContainer}>
                <Image source={require('../../assets/images/logo.jpeg')} style={styles.logoImage} />
              </View>

                <View style={styles.headerBlock}>
                  <Text style={styles.brandLabel}>SIMC · Login</Text>
                  <Text style={styles.title}>Bienvenido</Text>
                  <Text style={styles.subtitle}>Monitoreo agrícola inteligente</Text>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Correo electrónico</Text>
                  <View style={[styles.inputWrapper, validateEmail(email) && styles.inputValid]}>
                    <Text style={styles.inputIcon}>✉️</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="correo@ejemplo.com"
                      placeholderTextColor={colors.text.muted}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      value={email}
                      onChangeText={setEmail}
                      editable={!loading && !isLocked}
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Contraseña</Text>
                  <View style={[styles.inputWrapper, password.length >= 6 && styles.inputValid]}>
                    <Text style={styles.inputIcon}>🔒</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor={colors.text.muted}
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      editable={!loading && !isLocked}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      <Text style={styles.eyeText}>{showPassword ? "👁" : "👁️"}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.passwordStrengthRow}>
                    <View style={[styles.strengthBar, passwordStrength === "weak" && styles.strengthWeak]} />
                    <View style={[styles.strengthBar, passwordStrength === "fair" && styles.strengthFair]} />
                    <View style={[styles.strengthBar, passwordStrength === "strong" && styles.strengthStrong]} />
                  </View>
                </View>

                <View style={styles.optionsRow}>
                  <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)} disabled={loading}>
                    <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                      {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>Recordar sesión</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleForgotPassword} disabled={loading}>
                    <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.button, (loading || isLocked) && styles.buttonDisabled]}
                  onPress={handleLogin}
                  disabled={loading || isLocked}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.buttonText}>Iniciar sesión</Text>
                  )}
                </TouchableOpacity>

        {isLocked && (
                    <Text style={styles.lockMessage}>
                      Bloqueado por {lockRemaining}s. Demasiados intentos fallidos.
                    </Text>
                  )}
               </Animated.View>
            </KeyboardAvoidingView>
          </View>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundContainer: {
    flex: 1,
    width: "100%",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(34, 197, 94, 0.95)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.97)",
    borderRadius: 32,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 12,
    borderWidth: 1,
    borderColor: "rgba(21, 128, 61, 0.15)",
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  headerBlock: {
    marginBottom: 28,
  },
  brandLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
    textAlign: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.text.primary,
    textAlign: "center",
    letterSpacing: -1,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  inputWrapper: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  inputValid: {
    borderColor: colors.primary,
  },
  inputIcon: {
    fontSize: 18,
    marginLeft: 14,
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    fontSize: 16,
    color: colors.text.primary,
  },
  eyeButton: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: "center",
  },
  eyeText: {
    fontSize: 20,
  },
  passwordStrengthRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
    marginLeft: 4,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  strengthWeak: {
    backgroundColor: colors.error,
  },
  strengthFair: {
    backgroundColor: colors.warning,
  },
  strengthStrong: {
    backgroundColor: colors.primary,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    flexWrap: "wrap",
    gap: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  checkboxLabel: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  forgotPassword: {
    fontSize: 13,
    color: "rgba(255,255,255,0.95)",
    fontWeight: "600",
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
    shadowOpacity: 0,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  lockMessage: {
    fontSize: 13,
    color: colors.error,
    textAlign: "center",
    marginTop: 14,
    fontWeight: "600",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingVertical: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
});