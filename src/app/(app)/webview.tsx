import { router } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, type WebViewNavigation } from 'react-native-webview';

import { createInjectedBridge, parseWebViewMessage } from '@/webview/bridge';
import { demoHtml } from '@/webview/demo-html';

const configuredUrl = process.env.EXPO_PUBLIC_WEBVIEW_URL?.trim();
const platform = Platform.OS === 'ios' ? 'ios' : 'android';

export default function WebViewScreen() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  const handleNavigationChange = useCallback((state: WebViewNavigation) => {
    setCanGoBack(state.canGoBack);
  }, []);

  function handleWebViewBack() {
    if (canGoBack) {
      webViewRef.current?.goBack();
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.toolbar}>
        <Pressable
          accessibilityRole="button"
          disabled={!canGoBack}
          onPress={handleWebViewBack}
          style={[styles.toolbarButton, !canGoBack && styles.disabled]}>
          <Text style={styles.toolbarButtonText}>Atrás</Text>
        </Pressable>
        <Text numberOfLines={1} style={styles.title}>
          WebView
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.toolbarButton}>
          <Text style={styles.toolbarButtonText}>Cerrar</Text>
        </Pressable>
      </View>

      <WebView
        ref={webViewRef}
        injectedJavaScriptBeforeContentLoaded={createInjectedBridge(platform)}
        onMessage={(event) => {
          const request = parseWebViewMessage(event.nativeEvent.data);
          if (request) {
            Alert.alert(request.title, request.message);
          }
        }}
        onNavigationStateChange={handleNavigationChange}
        originWhitelist={['https://*', 'http://*', 'about:*']}
        source={configuredUrl ? { uri: configuredUrl } : { html: demoHtml }}
        style={styles.webView}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  toolbar: {
    minHeight: 54,
    paddingHorizontal: 12,
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  toolbarButton: {
    minWidth: 64,
    minHeight: 44,
    justifyContent: 'center',
  },
  toolbarButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.35,
  },
  title: {
    flex: 1,
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  webView: {
    flex: 1,
    backgroundColor: '#EFF6FF',
  },
});
