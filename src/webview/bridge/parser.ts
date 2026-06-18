import {
  BRIDGE_VERSION,
  BRIDGE_REQUEST_TYPE,
  type BridgeRequest,
  type GetContactsPayload,
  type OpenNativeAlertPayload,
  type ShareFilePayload,
} from './contracts';

const DEFAULT_CONTACT_LIMIT = 100;
const MAX_CONTACT_LIMIT = 500;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function parseBridgeRequest(rawMessage: string): BridgeRequest | null {
  try {
    const value: unknown = JSON.parse(rawMessage);

    if (
      !isRecord(value) ||
      value.version !== BRIDGE_VERSION ||
      !isNonEmptyString(value.requestId) ||
      !Object.values(BRIDGE_REQUEST_TYPE).includes(value.type as never) ||
      !isRecord(value.payload)
    ) {
      return null;
    }

    return {
      version: BRIDGE_VERSION,
      requestId: value.requestId.trim(),
      type: value.type as BridgeRequest['type'],
      payload: value.payload,
    };
  } catch {
    return null;
  }
}

export function parseOpenNativeAlertPayload(
  payload: Record<string, unknown>,
): OpenNativeAlertPayload | null {
  if (!isNonEmptyString(payload.title) || !isNonEmptyString(payload.message)) {
    return null;
  }

  return {
    title: payload.title.trim(),
    message: payload.message.trim(),
  };
}

export function parseGetContactsPayload(payload: Record<string, unknown>): GetContactsPayload {
  const requestedLimit =
    typeof payload.limit === 'number' && Number.isInteger(payload.limit)
      ? payload.limit
      : DEFAULT_CONTACT_LIMIT;

  return {
    limit: Math.min(Math.max(requestedLimit, 1), MAX_CONTACT_LIMIT),
  };
}

export function parseShareFilePayload(
  payload: Record<string, unknown>,
): ShareFilePayload | null {
  if (!isNonEmptyString(payload.url)) {
    return null;
  }

  try {
    const url = new URL(payload.url);
    if (url.protocol !== 'https:') {
      return null;
    }
  } catch {
    return null;
  }

  return {
    url: payload.url.trim(),
    ...(isNonEmptyString(payload.fileName) ? { fileName: payload.fileName.trim() } : {}),
    ...(isNonEmptyString(payload.mimeType) ? { mimeType: payload.mimeType.trim() } : {}),
    ...(isNonEmptyString(payload.dialogTitle)
      ? { dialogTitle: payload.dialogTitle.trim() }
      : {}),
  };
}
