export const BRIDGE_VERSION = 1;

export const BRIDGE_REQUEST_TYPE = {
  OPEN_NATIVE_ALERT: 'OPEN_NATIVE_ALERT',
  GET_CONTACTS: 'GET_CONTACTS',
  SHARE_FILE: 'SHARE_FILE',
} as const;

export type BridgeRequestType =
  (typeof BRIDGE_REQUEST_TYPE)[keyof typeof BRIDGE_REQUEST_TYPE];

export type BridgeRequest = {
  version: typeof BRIDGE_VERSION;
  requestId: string;
  type: BridgeRequestType;
  payload: Record<string, unknown>;
};

export type BridgeContact = {
  id: string;
  name: string;
  phones: { label: string | null; number: string }[];
  emails: { label: string | null; address: string }[];
};

export type BridgeError = {
  code:
    | 'INVALID_REQUEST'
    | 'PERMISSION_DENIED'
    | 'NOT_AVAILABLE'
    | 'DOWNLOAD_FAILED'
    | 'NATIVE_ERROR';
  message: string;
};

export type BridgeResponse =
  | {
      version: typeof BRIDGE_VERSION;
      requestId: string;
      ok: true;
      data: unknown;
    }
  | {
      version: typeof BRIDGE_VERSION;
      requestId: string;
      ok: false;
      error: BridgeError;
    };

export type OpenNativeAlertPayload = {
  title: string;
  message: string;
};

export type GetContactsPayload = {
  limit: number;
};

export type ShareFilePayload = {
  url: string;
  fileName?: string;
  mimeType?: string;
  dialogTitle?: string;
};
