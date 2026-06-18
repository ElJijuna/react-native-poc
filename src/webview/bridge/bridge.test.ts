import assert from 'node:assert/strict';
import test from 'node:test';

import { BRIDGE_VERSION } from './contracts';
import {
  parseBridgeRequest,
  parseGetContactsPayload,
  parseOpenNativeAlertPayload,
  parseShareFilePayload,
} from './parser';
import { createInjectedBridge, createResponseScript } from './transport';

test('parses versioned bridge request', () => {
  assert.deepEqual(
    parseBridgeRequest(
      JSON.stringify({
        version: BRIDGE_VERSION,
        requestId: 'req-1',
        type: 'GET_CONTACTS',
        payload: { limit: 25 },
      }),
    ),
    {
      version: BRIDGE_VERSION,
      requestId: 'req-1',
      type: 'GET_CONTACTS',
      payload: { limit: 25 },
    },
  );
});

test('rejects malformed, unknown and unsupported requests', () => {
  assert.equal(parseBridgeRequest('not-json'), null);
  assert.equal(
    parseBridgeRequest(
      JSON.stringify({ version: 2, requestId: 'x', type: 'GET_CONTACTS', payload: {} }),
    ),
    null,
  );
  assert.equal(
    parseBridgeRequest(
      JSON.stringify({ version: 1, requestId: 'x', type: 'UNKNOWN', payload: {} }),
    ),
    null,
  );
});

test('validates each request payload', () => {
  assert.deepEqual(parseOpenNativeAlertPayload({ title: ' Hola ', message: ' Mundo ' }), {
    title: 'Hola',
    message: 'Mundo',
  });
  assert.equal(parseOpenNativeAlertPayload({ title: '', message: 'Mundo' }), null);
  assert.deepEqual(parseGetContactsPayload({ limit: 900 }), { limit: 500 });
  assert.deepEqual(parseGetContactsPayload({}), { limit: 100 });
  assert.deepEqual(parseShareFilePayload({ url: 'https://example.com/file.pdf' }), {
    url: 'https://example.com/file.pdf',
  });
  assert.equal(parseShareFilePayload({ url: 'http://example.com/file.pdf' }), null);
});

test('creates web API and safe response script', () => {
  const injected = createInjectedBridge('android');
  assert.match(injected, /getContacts/);
  assert.match(injected, /shareFile/);
  assert.match(injected, /platform: "android"/);

  const response = createResponseScript({
    version: 1,
    requestId: 'req-1',
    ok: true,
    data: { value: '</script>' },
  });
  assert.doesNotMatch(response, /<\/script>/);
});
