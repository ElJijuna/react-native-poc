import { GlassView } from 'expo-glass-effect';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const icons = {
  index: '⌂',
  profile: '●',
  settings: '⚙',
} as const;

function TabIcon({ name, color }: { name: keyof typeof icons; color: ColorValue }) {
  return <Text style={[styles.icon, { color }]}>{icons[name]}</Text>;
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  const iosTabBarStyle = {
    position: 'absolute' as const,
    left: 20,
    right: 20,
    bottom: insets.bottom + 8,
    height: 56,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderRadius: 28,
    elevation: 0,
    shadowOpacity: 0,
  };

  const androidTabBarStyle = {
    height: 66,
    paddingTop: 6,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E2E8F0',
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: styles.label,
        tabBarStyle: Platform.OS === 'ios' ? iosTabBarStyle : androidTabBarStyle,
        tabBarBackground: Platform.OS === 'ios'
          ? () => <GlassView style={[StyleSheet.absoluteFill, styles.tabBarGlass]} />
          : undefined,
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
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarGlass: {
    borderRadius: 28,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
  icon: {
    fontSize: 22,
    lineHeight: 24,
  },
});
