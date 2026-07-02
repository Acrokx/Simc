import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, ScrollView, ImageBackground } from "react-native";
import { useRouter } from "expo-router";

const sections = [
  { title: "Fincas", description: "Administra fincas y cultivos.", route: "/fincas", color: "#E0F7F5", iconColor: "#0D7377" },
  { title: "Cultivos", description: "Gestiona tus cultivos activos.", route: "/cultivos", color: "#E8F4F3", iconColor: "#149E92" },
  { title: "Sensores", description: "Registra y administra sensores.", route: "/sensores", color: "#E8F8F6", iconColor: "#1AB8A8" },
  { title: "Alertas", description: "Revisa alertas importantes del sistema.", route: "/alertas", color: "#F0FCFB", iconColor: "#26C4C4" },
  { title: "Administración", description: "Gestiona agricultores y fincas (Solo admin).", route: "/admin", color: "#E0F7FA", iconColor: "#0D7377" },
] as const;

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0FDFB" />
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&h=1080&fit=crop' }} 
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <Text style={styles.heading}>Bienvenido a SIMC</Text>
              <Text style={styles.subtitle}>
                Estás dentro del panel principal. Selecciona una sección para continuar.
              </Text>
            </View>

            <View style={styles.cardsContainer}>
              {sections.map((section, index) => (
                <TouchableOpacity
                  key={section.title}
                  style={[styles.card, { backgroundColor: section.color }]}
                  onPress={() => router.push(section.route)}
                >
                  <View style={[styles.iconCircle, { backgroundColor: section.iconColor + '20' }]}>
                    <Text style={styles.icon}>{['🏘️', '🌱', '📡', '🚨', '⚙️'][index]}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{section.title}</Text>
                  <Text style={styles.cardText}>{section.description}</Text>
                  <View style={styles.cardArrow}>
                    <Text style={{ color: section.iconColor, fontSize: 20 }}>→</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace("/login") }>
              <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
            </TouchableOpacity>
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
    backgroundColor: "rgba(240, 253, 251, 0.9)",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  heading: {
    fontSize: 36,
    fontWeight: "800",
    color: "#0D7377",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#5A7D7C",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 320,
  },
  cardsContainer: {
    width: "100%",
  },
  card: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#0D7377",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(13, 115, 119, 0.1)",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  icon: {
    fontSize: 26,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0D7377",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#5A7D7C",
    lineHeight: 20,
    marginBottom: 12,
  },
  cardArrow: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  logoutButton: {
    backgroundColor: "#0D7377",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#0D7377",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});