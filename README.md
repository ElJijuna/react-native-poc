# React Native WebView POC

Expo Router POC para iOS y Android:

- Login local: `user` / `user`
- Dashboard con tres tabs
- Sesión en memoria
- WebView configurable
- Bridge Web ↔ React Native versionado
- Alert nativo, lectura de contactos y compartir archivos

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

Arquitectura, eventos, payloads, respuestas y ejemplos:

- [docs/WEBVIEW_BRIDGE.md](docs/WEBVIEW_BRIDGE.md)

## Verificación

```bash
npm test
npm run typecheck
npm run lint
```
