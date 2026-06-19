import { GlassView } from 'expo-glass-effect';
import { Tabs } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const icons = {
  index: '⌂',
  profile: '●',
  settings: '⚙',
} as const;

function TabIcon({ name, color }: { name: keyof typeof icons; color: ColorValue }) {
  return <Text style={[styles.icon, { color }]}>{icons[name]}</Text>;
}

type PillTabBarProps = {
  state: {
    routes: { key: string; name: string }[];
    index: number;
  };
  descriptors: Record<string, {
    options: {
      tabBarIcon?: (p: { focused: boolean; color: string; size: number }) => React.ReactNode;
      title?: string;
    };
  }>;
  navigation: {
    emit: (e: { type: string; target: string; canPreventDefault: boolean }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
};

function PillTabBar({ state, descriptors, navigation }: PillTabBarProps) {
  const insets = useSafeAreaInsets();

  const visibleRoutes = state.routes.filter(
    (route) => descriptors[route.key].options.tabBarIcon !== undefined,
  );

  return (
    <View style={[styles.pill, { bottom: insets.bottom + 8 }]}>
      {Platform.OS === 'ios' ? (
        <GlassView style={StyleSheet.absoluteFill} />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.pillAndroid]} />
      )}

      {visibleRoutes.map((route) => {
        const { options } = descriptors[route.key];
        const isFocused = state.routes[state.index]?.key === route.key;
        const color = isFocused ? '#007AFF' : '#8E8E93';

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            style={styles.tabItem}>
            {options.tabBarIcon?.({ color, focused: isFocused, size: 22 })}
            <Text style={[styles.tabLabel, { color }]}>
              {options.title ?? route.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <PillTabBar {...(props as unknown as PillTabBarProps)} />}
      screenOptions={{
        headerShown: false,
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
  pill: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  pillAndroid: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  icon: {
    fontSize: 22,
    lineHeight: 24,
  },
});
