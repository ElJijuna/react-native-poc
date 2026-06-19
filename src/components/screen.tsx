import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = PropsWithChildren<{
  title: string;
  description?: string;
}>;

export function Screen({ title, description, children }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.heading}>
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 24,
  },
  heading: {
    gap: 8,
  },
  title: {
    color: '#0F172A',
    fontSize: 30,
    fontWeight: '800',
  },
  description: {
    color: '#475569',
    fontSize: 16,
    lineHeight: 24,
  },
});
