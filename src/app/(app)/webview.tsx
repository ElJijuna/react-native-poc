import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, type WebViewNavigation } from 'react-native-webview';

import { handleBridgeMessage } from '@/webview/bridge/native-bridge';
import { createInjectedBridge } from '@/webview/bridge/transport';
import { demoHtml } from '@/webview/demo-html';

const configuredUrl = process.env.EXPO_PUBLIC_WEBVIEW_URL?.trim();
const bridgePlatform = Platform.OS === 'ios' ? 'ios' : 'android';

export default function WebViewScreen() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  const handleNavigationChange = useCallback((state: WebViewNavigation) => {
    setCanGoBack(state.canGoBack);
  }, []);

  function handleWebViewBack() {
    if (canGoBack) webViewRef.current?.goBack();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.toolbar}>
        <Pressable
          accessibilityRole="button"
          disabled={!canGoBack}
          hitSlop={8}
          onPress={handleWebViewBack}
          style={[styles.toolbarButton, !canGoBack && styles.disabled]}>
          <SymbolView
            name={{ ios: 'chevron.left', android: 'arrow_back' }}
            size={22}
            tintColor="#007AFF"
          />
        </Pressable>
        <View style={styles.spacer} />
        <Pressable
          accessibilityLabel="Cerrar"
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => router.back()}
          style={styles.toolbarButton}>
          <SymbolView
            name={{ ios: 'xmark', android: 'close' }}
            size={16}
            tintColor="#8E8E93"
          />
        </Pressable>
      </View>

      <WebView
        ref={webViewRef}
        injectedJavaScriptBeforeContentLoaded={createInjectedBridge(bridgePlatform)}
        onMessage={(event) => {
          void handleBridgeMessage(webViewRef.current, event.nativeEvent.data);
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
    height: 48,
    paddingHorizontal: 8,
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolbarButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.3,
  },
  spacer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});
