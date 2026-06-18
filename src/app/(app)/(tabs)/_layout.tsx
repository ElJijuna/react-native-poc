import { Tabs } from 'expo-router';
import { StyleSheet, Text, type ColorValue } from 'react-native';

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
});
