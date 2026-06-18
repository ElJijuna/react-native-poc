import { SymbolView } from 'expo-symbols';
import { router, Tabs } from 'expo-router';
import { Pressable, StyleSheet, Text, type ColorValue } from 'react-native';

const icons = {
  index: '⌂',
  profile: '●',
  settings: '⚙',
} as const;

function TabIcon({ name, color }: { name: keyof typeof icons; color: ColorValue }) {
  return <Text style={[styles.icon, { color }]}>{icons[name]}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.tabBar,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <TabIcon color={color} name="index" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <TabIcon color={color} name="profile" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color }) => <TabIcon color={color} name="settings" />,
        }}
      />
      <Tabs.Screen
        name="native-webview"
        options={{
          href: null,
          headerShown: true,
          title: 'Portal',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: '#2563EB',
          headerTitleStyle: { color: '#0F172A', fontWeight: '700' },
          headerLeft: () => (
            <Pressable
              accessibilityLabel="Volver al dashboard"
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => router.back()}
              style={styles.headerBack}>
              <SymbolView
                name={{ ios: 'chevron.left', android: 'arrow_back' }}
                size={20}
                tintColor="#2563EB"
              />
              <Text style={styles.headerBackText}>Inicio</Text>
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 66,
    paddingTop: 6,
    paddingBottom: 8,
    borderTopColor: '#E2E8F0',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
  icon: {
    fontSize: 22,
    lineHeight: 24,
  },
  headerBack: {
    minHeight: 44,
    minWidth: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    justifyContent: 'center',
    paddingRight: 8,
  },
  headerBackText: {
    color: '#2563EB',
    fontSize: 17,
    fontWeight: '500',
  },
});
