import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { Screen } from '@/components/screen';

export default function DashboardScreen() {
  return (
    <Screen
      title="Dashboard"
      description="POC de navegación y comunicación bidireccional con contenido web.">
      <View style={styles.card}>
        <Text style={styles.cardTitle}>WebView bridge</Text>
        <Text style={styles.cardText}>
          Abre página demo, detecta entorno nativo y solicita alert mediante postMessage.
        </Text>
        <AppButton label="Abrir WebView" onPress={() => router.push('/webview')} />
        <AppButton
          label="Abrir WebView con UI nativa"
          onPress={() => router.push('/native-webview')}
          variant="secondary"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    gap: 14,
  },
  cardTitle: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '800',
  },
  cardText: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 22,
  },
});
