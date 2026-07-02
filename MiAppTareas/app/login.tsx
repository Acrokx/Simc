import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";

export default function ObsoleteLoginRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/(auth)/login");
  }, [router]);
  return null;
}
