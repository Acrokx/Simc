import { useRouter } from "expo-router";

export function useNavigation() {
    const router = useRouter();
    const safeBack = () => {
        if (typeof window !== "undefined" && (window as any).history?.length > 2) {
            router.back();
        } else {
            router.replace("/home");
        }
    };
    const goHome = () => router.replace("/home");
    return { safeBack, goHome, router };
}