import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '@/auth/session';
import { AppButton } from '@/components/app-button';

export default function SignInScreen() {
  const { signIn } = useSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit() {
    setError('');

    if (!signIn(username.trim(), password)) {
      setError('Usuario o clave incorrectos.');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <View style={styles.card}>
          <View style={styles.heading}>
            <Text style={styles.eyebrow}>REACT NATIVE POC</Text>
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>Ingresa con credenciales demo.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Usuario</Text>
              <TextInput
                accessibilityLabel="Usuario"
                autoCapitalize="none"
                autoComplete="username"
                onChangeText={setUsername}
                placeholder="user"
                returnKeyType="next"
                style={styles.input}
                value={username}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Clave</Text>
              <TextInput
                accessibilityLabel="Clave"
                autoCapitalize="none"
                autoComplete="password"
                onChangeText={setPassword}
                onSubmitEditing={handleSubmit}
                placeholder="user"
                returnKeyType="done"
                secureTextEntry
                style={styles.input}
                value={password}
              />
            </View>

            {error ? (
              <Text accessibilityRole="alert" style={styles.error}>
                {error}
              </Text>
            ) : null}

            <AppButton label="Iniciar sesión" onPress={handleSubmit} />
          </View>

          <Text style={styles.hint}>
            Demo: <Text style={styles.hintStrong}>user / user</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EFF6FF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    gap: 28,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  heading: {
    gap: 8,
  },
  eyebrow: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    color: '#0F172A',
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    color: '#64748B',
    fontSize: 16,
  },
  form: {
    gap: 18,
  },
  field: {
    gap: 8,
  },
  label: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 16,
    color: '#0F172A',
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  error: {
    color: '#B91C1C',
    fontSize: 14,
  },
  hint: {
    color: '#64748B',
    textAlign: 'center',
  },
  hintStrong: {
    color: '#0F172A',
    fontWeight: '700',
  },
});
