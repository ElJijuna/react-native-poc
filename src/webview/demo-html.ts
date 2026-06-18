export const demoHtml = `
<!doctype html>
<html lang="es">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root { color-scheme: light; font-family: system-ui, -apple-system, sans-serif; }
      body { margin: 0; min-height: 100vh; background: #eff6ff; color: #0f172a; }
      main { width: min(86vw, 520px); margin: 28px auto; padding: 28px; box-sizing: border-box; border: 1px solid #dbeafe; border-radius: 22px; background: white; box-shadow: 0 18px 45px rgba(15, 23, 42, .1); }
      .tag { display: inline-block; padding: 6px 10px; border-radius: 999px; background: #dbeafe; color: #1d4ed8; font-size: 12px; font-weight: 800; }
      h1 { margin: 18px 0 8px; font-size: 28px; }
      h2 { margin: 30px 0 8px; font-size: 20px; }
      p { color: #475569; line-height: 1.55; }
      pre { overflow: auto; padding: 14px; border-radius: 12px; background: #f1f5f9; color: #334155; }
      button { width: 100%; min-height: 50px; margin-top: 12px; border: 0; border-radius: 14px; background: #2563eb; color: white; font-size: 16px; font-weight: 750; }
      button.secondary { background: #0f766e; }
      button.tertiary { background: #7c3aed; }
      #result { min-height: 44px; white-space: pre-wrap; }
      .feature-list { display: grid; gap: 12px; margin-top: 14px; }
      .feature { padding: 16px; border: 1px solid #e2e8f0; border-radius: 14px; background: #f8fafc; }
      .feature strong { display: block; margin-bottom: 4px; }
      .feature span { color: #64748b; font-size: 14px; line-height: 1.45; }
      footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; text-align: center; font-size: 13px; }
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

      <h2>Capacidades híbridas</h2>
      <p>Contenido web puede crecer normalmente mientras navegación, permisos y acciones sensibles permanecen nativas.</p>
      <section class="feature-list">
        <article class="feature">
          <strong>Contactos del dispositivo</strong>
          <span>Permiso solicitado por sistema. Web recibe solo campos definidos por contrato.</span>
        </article>
        <article class="feature">
          <strong>Compartir documentos</strong>
          <span>Native descarga archivo a cache y abre share sheet de iOS o Android.</span>
        </article>
        <article class="feature">
          <strong>Navegación consistente</strong>
          <span>Header y bottom tabs permanecen nativos alrededor del contenido web.</span>
        </article>
        <article class="feature">
          <strong>Bridge versionado</strong>
          <span>Cada solicitud usa requestId y recibe respuesta exitosa o error tipado.</span>
        </article>
      </section>

      <h2>Contenido adicional</h2>
      <p>
        Esta sección agrega altura real para demostrar desplazamiento dentro del WebView.
        Al llegar al final, contenido termina directamente sobre barra de navegación nativa,
        sin inset duplicado.
      </p>
      <footer>React Native POC · WebView Bridge v1</footer>
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
