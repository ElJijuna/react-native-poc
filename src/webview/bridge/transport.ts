import { BRIDGE_VERSION, type BridgeResponse } from './contracts';

export function createInjectedBridge(platform: 'ios' | 'android') {
  return `
    (function () {
      var pending = new Map();

      function request(type, payload) {
        return new Promise(function (resolve, reject) {
          var requestId = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
          pending.set(requestId, { resolve: resolve, reject: reject });

          window.ReactNativeWebView.postMessage(JSON.stringify({
            version: ${BRIDGE_VERSION},
            requestId: requestId,
            type: type,
            payload: payload || {}
          }));
        });
      }

      function receive(response) {
        var operation = pending.get(response.requestId);
        if (!operation) return;

        pending.delete(response.requestId);
        if (response.ok) operation.resolve(response.data);
        else operation.reject(response.error);

        window.dispatchEvent(new CustomEvent('ReactNativePOCResponse', {
          detail: response
        }));
      }

      window.ReactNativePOC = Object.freeze({
        version: ${BRIDGE_VERSION},
        isWebView: true,
        platform: ${JSON.stringify(platform)},
        request: request,
        getContacts: function (options) {
          return request('GET_CONTACTS', options || {});
        },
        shareFile: function (file) {
          return request('SHARE_FILE', file || {});
        },
        openNativeAlert: function (alert) {
          return request('OPEN_NATIVE_ALERT', alert || {});
        },
        __receive: receive
      });
    })();
    true;
  `;
}

export function createResponseScript(response: BridgeResponse) {
  const serializedResponse = JSON.stringify(response).replace(/</g, '\\u003c');

  return `
    window.ReactNativePOC && window.ReactNativePOC.__receive(${serializedResponse});
    true;
  `;
}
