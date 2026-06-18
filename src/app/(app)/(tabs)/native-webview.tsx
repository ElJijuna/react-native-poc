import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

import { handleBridgeMessage } from '@/webview/bridge/native-bridge';
import { createInjectedBridge } from '@/webview/bridge/transport';
import { demoHtml } from '@/webview/demo-html';

const configuredUrl = process.env.EXPO_PUBLIC_WEBVIEW_URL?.trim();
const platform = Platform.OS === 'ios' ? 'ios' : 'android';

export default function NativeWebViewScreen() {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  function reload() {
    setError(null);
    setIsLoading(true);
    webViewRef.current?.reload();
  }

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        {isLoading && !error ? (
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${Math.max(progress * 100, 5)}%` }]} />
          </View>
        ) : null}

        <WebView
          ref={webViewRef}
          injectedJavaScriptBeforeContentLoaded={createInjectedBridge(platform)}
          onError={(event) => {
            setError(event.nativeEvent.description || 'No se pudo cargar contenido.');
            setIsLoading(false);
          }}
          onHttpError={(event) => {
            setError(`Servidor respondió ${event.nativeEvent.statusCode}.`);
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
          <View pointerEvents="none" style={styles.loadingOverlay}>
            <View style={styles.loadingCard}>
              <ActivityIndicator color="#2563EB" size="small" />
              <Text style={styles.loadingText}>Cargando contenido…</Text>
            </View>
          </View>
        ) : null}

        {error ? (
          <View style={styles.errorOverlay}>
            <View style={styles.errorIcon}>
              <Text style={styles.errorIconText}>!</Text>
            </View>
            <Text style={styles.errorTitle}>Contenido no disponible</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable accessibilityRole="button" onPress={reload} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  progressTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 4,
    height: 3,
    backgroundColor: '#DBEAFE',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#2563EB',
  },
  webView: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 4,
  },
  loadingText: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '600',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 32,
    backgroundColor: '#F8FAFC',
  },
  errorIcon: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    backgroundColor: '#FEE2E2',
  },
  errorIconText: {
    color: '#B91C1C',
    fontSize: 28,
    fontWeight: '800',
  },
  errorTitle: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  errorText: {
    color: '#64748B',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  retryButton: {
    minHeight: 46,
    minWidth: 130,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    borderRadius: 14,
    backgroundColor: '#2563EB',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
