export const demoHtml = `
<!doctype html>
<html lang="es">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root { color-scheme: light; font-family: system-ui, -apple-system, sans-serif; }
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #eff6ff; color: #0f172a; }
      main { width: min(86vw, 520px); padding: 28px; box-sizing: border-box; border: 1px solid #dbeafe; border-radius: 22px; background: white; box-shadow: 0 18px 45px rgba(15, 23, 42, .1); }
      .tag { display: inline-block; padding: 6px 10px; border-radius: 999px; background: #dbeafe; color: #1d4ed8; font-size: 12px; font-weight: 800; }
      h1 { margin: 18px 0 8px; font-size: 28px; }
      p { color: #475569; line-height: 1.55; }
      pre { overflow: auto; padding: 14px; border-radius: 12px; background: #f1f5f9; color: #334155; }
      button { width: 100%; min-height: 50px; margin-top: 12px; border: 0; border-radius: 14px; background: #2563eb; color: white; font-size: 16px; font-weight: 750; }
    </style>
  </head>
  <body>
    <main>
      <span class="tag" id="status">Verificando bridge…</span>
      <h1>Web dentro de Native</h1>
      <p>Esta página lee variable inyectada y envía mensaje JSON hacia React Native.</p>
      <pre id="environment"></pre>
      <button id="open-alert">Abrir alert nativo</button>
    </main>
    <script>
      const environment = window.ReactNativePOC || { isWebView: false, platform: 'browser' };
      document.getElementById('environment').textContent = JSON.stringify(environment, null, 2);
      document.getElementById('status').textContent = environment.isWebView
        ? 'Bridge activo · ' + environment.platform
        : 'Navegador externo';

      document.getElementById('open-alert').addEventListener('click', function () {
        if (!window.ReactNativeWebView) {
          window.alert('ReactNativeWebView no está disponible');
          return;
        }

        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'OPEN_NATIVE_ALERT',
          payload: {
            title: 'Mensaje web',
            message: 'Hola desde WebView'
          }
        }));
      });
    </script>
  </body>
</html>
`;
