import assert from 'node:assert/strict';
import test from 'node:test';

import { validateCredentials } from './credentials';

test('accepts demo credentials', () => {
  assert.equal(validateCredentials('user', 'user'), true);
});

test('rejects incorrect credentials', () => {
  assert.equal(validateCredentials('admin', 'user'), false);
  assert.equal(validateCredentials('user', 'wrong'), false);
  assert.equal(validateCredentials('', ''), false);
});
