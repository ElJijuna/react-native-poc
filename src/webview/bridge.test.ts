import assert from 'node:assert/strict';
import test from 'node:test';

import { createInjectedBridge, parseWebViewMessage } from './bridge';

test('parses valid native alert request', () => {
  assert.deepEqual(
    parseWebViewMessage(
      JSON.stringify({
        type: 'OPEN_NATIVE_ALERT',
        payload: { title: ' Mensaje web ', message: ' Hola desde WebView ' },
      }),
    ),
    { title: 'Mensaje web', message: 'Hola desde WebView' },
  );
});

test('ignores malformed and unknown messages', () => {
  assert.equal(parseWebViewMessage('not-json'), null);
  assert.equal(parseWebViewMessage(JSON.stringify({ type: 'UNKNOWN' })), null);
  assert.equal(
    parseWebViewMessage(
      JSON.stringify({
        type: 'OPEN_NATIVE_ALERT',
        payload: { title: '', message: 123 },
      }),
    ),
    null,
  );
});

test('injects native environment metadata', () => {
  const script = createInjectedBridge('android');

  assert.match(script, /isWebView: true/);
  assert.match(script, /platform: "android"/);
});
