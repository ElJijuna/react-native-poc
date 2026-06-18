export const OPEN_NATIVE_ALERT = 'OPEN_NATIVE_ALERT';

export type NativeAlertRequest = {
  title: string;
  message: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseWebViewMessage(rawMessage: string): NativeAlertRequest | null {
  try {
    const message: unknown = JSON.parse(rawMessage);

    if (!isRecord(message) || message.type !== OPEN_NATIVE_ALERT || !isRecord(message.payload)) {
      return null;
    }

    const { title, message: body } = message.payload;

    if (
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      title.trim().length === 0 ||
      body.trim().length === 0
    ) {
      return null;
    }

    return {
      title: title.trim(),
      message: body.trim(),
    };
  } catch {
    return null;
  }
}

export function createInjectedBridge(platform: 'ios' | 'android') {
  return `
    window.ReactNativePOC = Object.freeze({
      isWebView: true,
      platform: ${JSON.stringify(platform)}
    });
    true;
  `;
}
