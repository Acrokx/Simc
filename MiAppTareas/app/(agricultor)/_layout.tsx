import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "../../theme";

export default function AgricultorLayout() {
  return (
    <SafeAreaProvider>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }} 
      />
    </SafeAreaProvider>
  );
}