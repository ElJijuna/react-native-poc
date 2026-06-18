import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';

export default function ProfileScreen() {
  return (
    <Screen title="Perfil" description="Sesión demo activa solo mientras app permanece abierta.">
      <View style={styles.card}>
        <Text style={styles.avatar}>U</Text>
        <View style={styles.details}>
          <Text style={styles.name}>Usuario demo</Text>
          <Text style={styles.username}>@user</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderColor: '#E2E8F0',
    borderWidth: 1,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#DBEAFE',
    color: '#1D4ED8',
    textAlign: 'center',
    lineHeight: 58,
    fontSize: 24,
    fontWeight: '800',
  },
  details: {
    gap: 4,
  },
  name: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '800',
  },
  username: {
    color: '#64748B',
    fontSize: 15,
  },
});
