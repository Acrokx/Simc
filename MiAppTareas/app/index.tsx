import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { colors } from "../theme";

export default function Index() {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.backgroundContainer}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1920&h=1080&fit=crop" }}
          style={styles.backgroundImage}
          contentFit="cover"
        />
        <View style={styles.overlay}>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerCard}>
              <Text style={styles.heading}>SIMC</Text>
              <Text style={styles.subtitle}>Sistema Inteligente de Monitoreo de Cultivos</Text>
              <Text style={styles.description}>
                Gestiona tus cultivos, sensores y alertas desde una sola app.
              </Text>
            </View>

            <Link href="/(auth)/login" asChild>
              <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
                <Text style={styles.primaryButtonText}>Comenzar</Text>
              </TouchableOpacity>
            </Link>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  backgroundContainer: { flex: 1, width: "100%" },
  backgroundImage: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  overlay: { flex: 1, backgroundColor: "rgba(255, 255, 255, 0.92)", justifyContent: "center" },
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 24, gap: 32 },
  headerCard: {
    backgroundColor: colors.card,
    borderRadius: 32,
    padding: 36,
    marginBottom: 32,
    alignItems: "center",
    maxWidth: 400,
    width: "100%",
    gap: 10,
  },
  heading: { fontSize: 48, fontWeight: "800", color: colors.primary, textAlign: "center", letterSpacing: -2 },
  subtitle: { fontSize: 16, fontWeight: "600", color: colors.text.secondary, textAlign: "center", marginBottom: 12, lineHeight: 22 },
  description: { fontSize: 14, color: colors.text.secondary, textAlign: "center", lineHeight: 20 },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    width: "100%",
    maxWidth: 320,
  },
  primaryButtonText: { color: colors.card, fontSize: 18, fontWeight: "800", letterSpacing: 0.3 },
});
