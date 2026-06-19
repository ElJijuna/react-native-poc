import { GlassView } from 'expo-glass-effect';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { handleBridgeMessage } from '@/webview/bridge/native-bridge';
import { createInjectedBridge } from '@/webview/bridge/transport';
import { demoHtml } from '@/webview/demo-html';

const configuredUrl = process.env.EXPO_PUBLIC_WEBVIEW_URL?.trim();
const bridgePlatform = Platform.OS === 'ios' ? 'ios' : 'android';

// Pill height (56) + gap (8) = 64px above home indicator
const TAB_PILL_CLEARANCE = 64;

export default function NativeWebViewScreen() {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  function reload() {
    setError(null);
    setIsLoading(true);
    webViewRef.current?.reload();
  }

  return (
    <View style={styles.root}>
      <WebView
        ref={webViewRef}
        contentInset={Platform.OS === 'ios' ? { bottom: TAB_PILL_CLEARANCE } : undefined}
        contentInsetAdjustmentBehavior="automatic"
        injectedJavaScriptBeforeContentLoaded={createInjectedBridge(bridgePlatform)}
        onError={(event) => {
          setError(event.nativeEvent.description || 'No se pudo cargar contenido.');
          setIsLoading(false);
        }}
        onHttpError={(event) => {
          setError(`El servidor respondió ${event.nativeEvent.statusCode}.`);
          setIsLoading(false);
        }}
        onLoadEnd={() => {
          setIsLoading(false);
          setProgress(1);
        }}
        onLoadProgress={(event) => setProgress(event.nativeEvent.progress)}
        onLoadStart={() => {
          setError(null);
          setIsLoading(true);
          setProgress(0);
        }}
        onMessage={(event) => {
          void handleBridgeMessage(webViewRef.current, event.nativeEvent.data);
        }}
        originWhitelist={['https://*', 'http://*', 'about:*']}
        source={configuredUrl ? { uri: configuredUrl } : { html: demoHtml }}
        style={styles.webView}
      />

      {isLoading && !error ? (
        <View pointerEvents="none" style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: `${Math.max(progress * 100, 5)}%` }]} />
        </View>
      ) : null}

      {/* Floating circular back button */}
      {Platform.OS === 'ios' ? (
        <GlassView style={[styles.backCircle, { top: insets.top + 8 }]}>
          <Pressable
            accessibilityLabel="Volver"
            accessibilityRole="button"
            hitSlop={12}
            onPress={() => router.back()}
            style={styles.backPressable}>
            <SymbolView name="chevron.left" size={18} tintColor="#007AFF" />
          </Pressable>
        </GlassView>
      ) : (
        <Pressable
          accessibilityLabel="Volver"
          accessibilityRole="button"
          onPress={() => router.back()}
          style={[styles.backCircle, styles.backCircleAndroid, { top: insets.top + 8 }]}>
          <SymbolView name={{ ios: 'chevron.left', android: 'arrow_back' }} size={18} tintColor="#007AFF" />
        </Pressable>
      )}

      {isLoading && !error ? (
        <View pointerEvents="none" style={styles.loadingOverlay}>
          {Platform.OS === 'ios' ? (
            <GlassView style={styles.loadingPill}>
              <ActivityIndicator color="#007AFF" size="small" />
              <Text style={styles.loadingText}>Cargando…</Text>
            </GlassView>
          ) : (
            <View style={[styles.loadingPill, styles.loadingPillAndroid]}>
              <ActivityIndicator color="#007AFF" size="small" />
              <Text style={styles.loadingText}>Cargando…</Text>
            </View>
          )}
        </View>
      ) : null}

      {error ? (
        <View style={styles.errorOverlay}>
          {Platform.OS === 'ios' ? (
            <GlassView style={styles.errorCard}>
              <ErrorContent error={error} onRetry={reload} />
            </GlassView>
          ) : (
            <View style={[styles.errorCard, styles.errorCardAndroid]}>
              <ErrorContent error={error} onRetry={reload} />
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
}

function ErrorContent({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <>
      <SymbolView
        name={{ ios: 'wifi.slash', android: 'wifi_off' }}
        size={36}
        tintColor="#FF3B30"
      />
      <Text style={styles.errorTitle}>Sin conexión</Text>
      <Text style={styles.errorText}>{error}</Text>
      <Pressable accessibilityRole="button" onPress={onRetry} style={styles.retryButton}>
        <Text style={styles.retryText}>Reintentar</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  progressTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 4,
    height: 2,
  },
  progressBar: {
    height: 2,
    backgroundColor: '#007AFF',
  },
  backCircle: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  backPressable: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backCircleAndroid: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    elevation: 4,
  },
  loadingOverlay: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 22,
  },
  loadingPillAndroid: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    elevation: 8,
  },
  loadingText: {
    color: '#1C1C1E',
    fontSize: 15,
    fontWeight: '500',
  },
  errorOverlay: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorCard: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 28,
    paddingVertical: 32,
    borderRadius: 28,
  },
  errorCardAndroid: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    elevation: 8,
  },
  errorTitle: {
    color: '#1C1C1E',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorText: {
    color: '#8E8E93',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 22,
    backgroundColor: '#007AFF',
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
