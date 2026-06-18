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
      button.secondary { background: #0f766e; }
      button.tertiary { background: #7c3aed; }
      #result { min-height: 44px; white-space: pre-wrap; }
    </style>
  </head>
  <body>
    <main>
      <span class="tag" id="status">Verificando bridge…</span>
      <h1>Web dentro de Native</h1>
      <p>Esta página lee variable inyectada y envía mensaje JSON hacia React Native.</p>
      <pre id="environment"></pre>
      <button id="open-alert">Abrir alert nativo</button>
      <button class="secondary" id="get-contacts">Obtener contactos</button>
      <button class="tertiary" id="share-file">Compartir PDF demo</button>
      <pre id="result">Resultado aparecerá aquí.</pre>
    </main>
    <script>
      const environment = window.ReactNativePOC || { isWebView: false, platform: 'browser' };
      document.getElementById('environment').textContent = JSON.stringify(environment, null, 2);
      document.getElementById('status').textContent = environment.isWebView
        ? 'Bridge activo · ' + environment.platform
        : 'Navegador externo';

      const result = document.getElementById('result');

      function showResult(value) {
        result.textContent = JSON.stringify(value, null, 2);
      }

      document.getElementById('open-alert').addEventListener('click', async function () {
        try {
          showResult(await window.ReactNativePOC.openNativeAlert({
            title: 'Mensaje web',
            message: 'Hola desde WebView'
          }));
        } catch (error) {
          showResult(error);
        }
      });

      document.getElementById('get-contacts').addEventListener('click', async function () {
        try {
          showResult(await window.ReactNativePOC.getContacts({ limit: 20 }));
        } catch (error) {
          showResult(error);
        }
      });

      document.getElementById('share-file').addEventListener('click', async function () {
        try {
          showResult(await window.ReactNativePOC.shareFile({
            url: 'https://pdfobject.com/pdf/sample.pdf',
            fileName: 'webview-bridge-demo.pdf',
            mimeType: 'application/pdf',
            dialogTitle: 'Compartir archivo demo'
          }));
        } catch (error) {
          showResult(error);
        }
      });
    </script>
  </body>
</html>
`;
