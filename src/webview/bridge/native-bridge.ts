import { Alert } from 'react-native';
import type { WebView } from 'react-native-webview';

import {
  BRIDGE_VERSION,
  BRIDGE_REQUEST_TYPE,
  type BridgeError,
  type BridgeResponse,
} from './contracts';
import {
  parseBridgeRequest,
  parseGetContactsPayload,
  parseOpenNativeAlertPayload,
  parseShareFilePayload,
} from './parser';
import { getContacts } from './services/contacts-service';
import { shareRemoteFile } from './services/file-sharing-service';
import { createResponseScript } from './transport';

type WebViewTarget = Pick<WebView, 'injectJavaScript'>;

function errorFor(error: unknown): BridgeError {
  const code = error instanceof Error ? error.message : 'NATIVE_ERROR';

  if (code === 'PERMISSION_DENIED') {
    return { code, message: 'Permiso de contactos denegado.' };
  }
  if (code === 'NOT_AVAILABLE') {
    return { code, message: 'Compartir archivos no está disponible.' };
  }
  if (code === 'DOWNLOAD_FAILED') {
    return { code, message: 'No se pudo descargar archivo.' };
  }

  return { code: 'NATIVE_ERROR', message: 'Operación nativa falló.' };
}

function respond(webView: WebViewTarget | null, response: BridgeResponse) {
  webView?.injectJavaScript(createResponseScript(response));
}

export async function handleBridgeMessage(webView: WebViewTarget | null, rawMessage: string) {
  const request = parseBridgeRequest(rawMessage);
  if (!request) return;

  try {
    let data: unknown;

    switch (request.type) {
      case BRIDGE_REQUEST_TYPE.OPEN_NATIVE_ALERT: {
        const payload = parseOpenNativeAlertPayload(request.payload);
        if (!payload) throw new Error('INVALID_REQUEST');
        Alert.alert(payload.title, payload.message);
        data = { opened: true };
        break;
      }
      case BRIDGE_REQUEST_TYPE.GET_CONTACTS: {
        const payload = parseGetContactsPayload(request.payload);
        data = { contacts: await getContacts(payload.limit) };
        break;
      }
      case BRIDGE_REQUEST_TYPE.SHARE_FILE: {
        const payload = parseShareFilePayload(request.payload);
        if (!payload) throw new Error('INVALID_REQUEST');
        data = await shareRemoteFile(payload);
        break;
      }
    }

    respond(webView, {
      version: BRIDGE_VERSION,
      requestId: request.requestId,
      ok: true,
      data,
    });
  } catch (error) {
    const bridgeError =
      error instanceof Error && error.message === 'INVALID_REQUEST'
        ? { code: 'INVALID_REQUEST' as const, message: 'Payload inválido.' }
        : errorFor(error);

    respond(webView, {
      version: BRIDGE_VERSION,
      requestId: request.requestId,
      ok: false,
      error: bridgeError,
    });
  }
}
