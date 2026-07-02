import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

export default function Index() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0FDFB" />
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1920&h=1080&fit=crop' }} 
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerCard}>
              <Text style={styles.heading}>SIMC</Text>
              <Text style={styles.subtitle}>Sistema de Información para el Manejo de Cultivos</Text>
              <Text style={styles.description}>
                Aplicación móvil para la gestión inteligente de cultivos, monitoreo de sensores, 
                control de riegos y generación de alertas en tiempo real.
              </Text>
              <Text style={styles.description}>
                Optimiza tus procesos agrícolas con tecnología de punta.
              </Text>
            </View>

            <Link href="/login" asChild>
              <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
              </TouchableOpacity>
            </Link>
          </ScrollView>
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
    backgroundColor: "rgba(240, 253, 251, 0.95)",
    justifyContent: "center",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    marginBottom: 32,
    shadowColor: "#0D7377",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 12,
    alignItems: "center",
    maxWidth: 400,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(13, 115, 119, 0.1)",
  },
  heading: {
    fontSize: 48,
    fontWeight: "800",
    color: "#0D7377",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#14A095",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#5A7D7C",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 12,
  },
  loginButton: {
    backgroundColor: "#0D7377",
    paddingVertical: 18,
    paddingHorizontal: 56,
    borderRadius: 16,
    shadowColor: "#0D7377",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});