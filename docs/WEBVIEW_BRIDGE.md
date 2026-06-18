# WebView Bridge

Contrato versionado para comunicación Web ↔ React Native.

## Arquitectura

```text
Web API (window.ReactNativePOC)
  → postMessage(request)
  → parser + validación
  → NativeBridge dispatcher
  → servicio nativo
  → injectJavaScript(response)
  → Promise web + evento ReactNativePOCResponse
```

Capas:

- `contracts.ts`: tipos, versión y nombres de eventos.
- `parser.ts`: parseo y validación sin dependencias nativas.
- `native-bridge.ts`: dispatcher; no contiene implementación de contactos/archivos.
- `services/`: adaptadores Expo para capacidades nativas.
- `transport.ts`: API inyectada y respuestas Native → Web.

## API inyectada

Disponible antes de cargar contenido:

```ts
window.ReactNativePOC = {
  version: 1,
  isWebView: true,
  platform: 'ios' | 'android',
  request(type, payload): Promise<unknown>,
  openNativeAlert(payload): Promise<{ opened: true }>,
  getContacts(payload?): Promise<{ contacts: BridgeContact[] }>,
  shareFile(payload): Promise<{ shared: true; fileName: string }>
};
```

Cada operación genera `requestId`. Native responde al mismo ID. Promise se resuelve o rechaza.

También se emite evento opcional:

```js
window.addEventListener('ReactNativePOCResponse', event => {
  console.log(event.detail);
});
```

## Envelope

Solicitud Web → Native:

```json
{
  "version": 1,
  "requestId": "mabc123-x7",
  "type": "GET_CONTACTS",
  "payload": {}
}
```

Respuesta exitosa:

```json
{
  "version": 1,
  "requestId": "mabc123-x7",
  "ok": true,
  "data": {}
}
```

Respuesta fallida:

```json
{
  "version": 1,
  "requestId": "mabc123-x7",
  "ok": false,
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "Permiso de contactos denegado."
  }
}
```

## Eventos

### `OPEN_NATIVE_ALERT`

```js
await window.ReactNativePOC.openNativeAlert({
  title: 'Mensaje web',
  message: 'Hola desde WebView'
});
```

### `GET_CONTACTS`

Solicita permiso del sistema. Devuelve máximo 100 contactos por defecto; `limit` permitido: 1–500.

```js
const { contacts } = await window.ReactNativePOC.getContacts({ limit: 50 });
```

Forma de contacto:

```ts
type BridgeContact = {
  id: string;
  name: string;
  phones: Array<{ label: string | null; number: string }>;
  emails: Array<{ label: string | null; address: string }>;
};
```

Solo estos campos salen del dispositivo. Si usuario deniega permiso, Promise rechaza con
`PERMISSION_DENIED`.

### `SHARE_FILE`

Native descarga archivo HTTPS a cache temporal y abre share sheet del sistema.

```js
await window.ReactNativePOC.shareFile({
  url: 'https://example.com/report.pdf',
  fileName: 'report.pdf',
  mimeType: 'application/pdf',
  dialogTitle: 'Compartir reporte'
});
```

Reglas:

- `url` obligatorio; solo HTTPS.
- `fileName`, `mimeType`, `dialogTitle` opcionales.
- Archivo queda en cache administrada por sistema.
- Errores posibles: `INVALID_REQUEST`, `NOT_AVAILABLE`, `DOWNLOAD_FAILED`, `NATIVE_ERROR`.

## Seguridad y evolución

- No aceptar mensajes sin `version`, `requestId`, `type` y `payload`.
- No exponer datos extra de contactos sin ampliar contrato y versión.
- Mantener URLs de archivos en HTTPS.
- Agregar capacidades como nuevo `type`, parser y servicio aislado.
- Cambios incompatibles requieren incrementar `BRIDGE_VERSION`.

## TypeScript para web externa

```ts
declare global {
  interface Window {
    ReactNativePOC?: {
      version: number;
      isWebView: boolean;
      platform: 'ios' | 'android';
      openNativeAlert(payload: { title: string; message: string }): Promise<{ opened: true }>;
      getContacts(payload?: { limit?: number }): Promise<{ contacts: BridgeContact[] }>;
      shareFile(payload: {
        url: string;
        fileName?: string;
        mimeType?: string;
        dialogTitle?: string;
      }): Promise<{ shared: true; fileName: string }>;
    };
  }
}
```
