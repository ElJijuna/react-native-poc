import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import type { ShareFilePayload } from '../contracts';

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
}

export async function shareRemoteFile(payload: ShareFilePayload) {
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('NOT_AVAILABLE');
  }

  const cacheDirectory = new Directory(Paths.cache, 'webview-bridge');
  cacheDirectory.create({ idempotent: true, intermediates: true });

  const destination = payload.fileName
    ? new File(
        cacheDirectory,
        `${Date.now()}-${sanitizeFileName(payload.fileName) || 'shared-file'}`,
      )
    : cacheDirectory;

  let file: File;

  try {
    file = await File.downloadFileAsync(payload.url, destination, { idempotent: true });
  } catch {
    throw new Error('DOWNLOAD_FAILED');
  }

  await Sharing.shareAsync(file.uri, {
    ...(payload.mimeType ? { mimeType: payload.mimeType } : {}),
    ...(payload.dialogTitle ? { dialogTitle: payload.dialogTitle } : {}),
  });

  return { shared: true, fileName: file.name };
}
