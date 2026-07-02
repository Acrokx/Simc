import { View, StyleSheet } from 'react-native';
import { Sidebar } from './Sidebar';
import { Breadcrumb } from './Breadcrumb';
import { ADMIN_BOTTOM_NAV } from './navigation';
import { BottomNav } from './BottomNav';
import { useRouter } from 'expo-router';

interface AdminLayoutProps {
    children: React.ReactNode;
    breadcrumbItems: { label: string; route?: string }[];
}

export function AdminLayout({ children, breadcrumbItems }: AdminLayoutProps) {
    const router = useRouter();
    
    return (
        <View style={styles.container}>
            <Sidebar />
            <View style={styles.content}>
                <Breadcrumb items={breadcrumbItems} />
                {children}
            </View>
            <BottomNav 
                items={ADMIN_BOTTOM_NAV} 
                activeRoute="/home" 
                onPress={(route) => router.replace(route)} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
    },
    content: {
        flex: 1
    }
});