import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="webview"
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="native-webview"
        options={{
          headerShown: true,
          title: 'Portal',
          headerBackTitle: 'Inicio',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: '#2563EB',
          headerTitleStyle: { color: '#0F172A', fontWeight: '700' },
        }}
      />
    </Stack>
  );
}
