import { useEffect } from "react";
import { Stack, usePathname, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "../theme";
import { getStoredUser } from "../lib/storage";

const PROTECTED_ROUTES = [
  "/(admin)/dashboard",
  "/(agricultor)/dashboard",
  "/(admin)/usuarios",
  "/(admin)/cultivos",
  "/(admin)/fincas",
  "/(admin)/sensores",
  "/(agricultor)/mis-cultivos",
  "/(agricultor)/alertas",
  "/(agricultor)/sensores",
  "/(agricultor)/mis-fincas",
  "/(agricultor)/riego",
  "/(agricultor)/estadisticas",
  "/(agricultor)/notificaciones",
  "/(admin)/alertas",
  "/(admin)/mediciones",
  "/(admin)/perfil",
  "/(admin)/configuracion",
  "/(admin)/reportes",
  "/(admin)/seguridad",
  "/(agricultor)/perfil",
  "/(agricultor)/clima",
  "/(agricultor)/reportes",
];

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const enforceAuth = async () => {
      const user = await getStoredUser();
      const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
      const isAuthRoute = pathname === "/(auth)/login";

      if (isProtected && !user) {
        router.replace("/(auth)/login" as any);
        return;
      }

      if (isAuthRoute && user) {
        const rol = (user.rol || "").toLowerCase();
        router.replace(rol === "administrador" ? "/(admin)/dashboard" : "/(agricultor)/dashboard" as any);
      }
    };

    enforceAuth();
  }, [pathname, router]);

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "fade_from_bottom",
        }}
      />
    </SafeAreaProvider>
  );
}
