# React Native WebView POC

Expo Router POC para iOS y Android:

- Login local: `user` / `user`
- Dashboard con tres tabs
- Sesión en memoria
- WebView configurable
- Bridge Web → React Native para abrir `Alert.alert`

## Ejecutar

```bash
npm install
npm run ios
# o
npm run android
```

Sin configuración, WebView carga demo HTML embebido. Para usar web externa:

```bash
cp .env.example .env
```

Luego define `EXPO_PUBLIC_WEBVIEW_URL`.

## Contrato WebView

React Native inyecta antes de cargar página:

```js
window.ReactNativePOC = {
  isWebView: true,
  platform: 'ios' // o 'android'
};
```

Web solicita alert nativo:

```js
window.ReactNativeWebView.postMessage(
  JSON.stringify({
    type: 'OPEN_NATIVE_ALERT',
    payload: {
      title: 'Mensaje web',
      message: 'Hola desde WebView'
    }
  })
);
```

Mensajes inválidos o tipos desconocidos son ignorados.

## Verificación

```bash
npm test
npm run typecheck
npm run lint
```
