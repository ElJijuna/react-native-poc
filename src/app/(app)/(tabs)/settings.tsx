import { StyleSheet, Text, View } from 'react-native';

import { useSession } from '@/auth/session';
import { AppButton } from '@/components/app-button';
import { Screen } from '@/components/screen';

export default function SettingsScreen() {
  const { signOut } = useSession();

  return (
    <Screen title="Ajustes" description="Controles disponibles para POC.">
      <View style={styles.card}>
        <Text style={styles.title}>Sesión</Text>
        <Text style={styles.text}>Cerrar sesión elimina estado en memoria y vuelve al login.</Text>
        <AppButton label="Cerrar sesión" onPress={signOut} variant="danger" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    gap: 14,
    borderColor: '#E2E8F0',
    borderWidth: 1,
  },
  title: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '800',
  },
  text: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 22,
  },
});
