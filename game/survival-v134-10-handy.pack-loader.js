// Generated v134-10 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-10-handy.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-10-handy.pck.part00","bytes":25165824,"sha256":"f8987bdc0cb10e9acad99415ea1e062fa2a85f57c9064805b3c1b54e565d3d35"},{"file":"survival-v134-10-handy.pck.part01","bytes":25165824,"sha256":"9601bd29c278fee7364c319e0b854bc8c31c739a8c145dfc84d8d43809150841"},{"file":"survival-v134-10-handy.pck.part02","bytes":25165824,"sha256":"2dd92c73b9e30ad71ed61b3ca74e5ff4c283c8fb3cb8b017c9e18a2dde4ce7ae"},{"file":"survival-v134-10-handy.pck.part03","bytes":25165824,"sha256":"11347b332352d2e36429bb31ba917f7682e5d8200d7afcf96a32f788512870a7"},{"file":"survival-v134-10-handy.pck.part04","bytes":25165824,"sha256":"32767840eb2aba0b36546482738e476650d8ed5d1d9f31c881819bf2fb8e9340"},{"file":"survival-v134-10-handy.pck.part05","bytes":7896940,"sha256":"29d96ad3b01e228828b7c18db35aa5314f3da744dd03dc2400b613541a01f139"}];
  const size = 133726060;
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url, document.baseURI).href;
    if (url !== pack || (init?.method || input?.method || 'GET').toUpperCase() !== 'GET') return originalFetch(input, init);
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for (const part of parts) {
            const response = await originalFetch(new URL(part.file, document.baseURI));
            if (!response.ok) throw new Error('Game package part unavailable: ' + part.file);
            const reader = response.body.getReader();
            let received = 0;
            while (true) {
              const chunk = await reader.read();
              if (chunk.done) break;
              received += chunk.value.byteLength;
              controller.enqueue(chunk.value);
            }
            if (received !== part.bytes) throw new Error('Incomplete game package part: ' + part.file);
          }
          controller.close();
        } catch (error) { controller.error(error); }
      }
    });
    return new Response(stream, {status:200, headers:{'Content-Type':'application/octet-stream', 'Content-Length':String(size)}});
  };
})();
