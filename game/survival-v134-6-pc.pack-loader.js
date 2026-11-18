// Generated v134-6 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-6-pc.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-6-pc.pck.part00","bytes":25165824,"sha256":"c2e2d4754b7f9b63fe0f5cca43be29ca85cde94713155fe8689cae52e77a9897"},{"file":"survival-v134-6-pc.pck.part01","bytes":25165824,"sha256":"34a186ebf342f5d9ee59d1a0fb62849fa9de93e0aafe3e7d3f7d036b697d1dee"},{"file":"survival-v134-6-pc.pck.part02","bytes":25165824,"sha256":"2a8f0cc5816bf7e3be6cd5c77fb2af8878235873ca12f75718661c19c8d8abec"},{"file":"survival-v134-6-pc.pck.part03","bytes":25165824,"sha256":"8a68ff48eb46cb710addf382a110ae56778f7f87a5336b8a3fadb3a68c8bdcfb"},{"file":"survival-v134-6-pc.pck.part04","bytes":25165824,"sha256":"17e9082ef989d719fa3d548eaccc00cd9a93c74c873d26f793f0e9fad3a2d974"},{"file":"survival-v134-6-pc.pck.part05","bytes":5351096,"sha256":"ede64a065bfaeb30e58df84b8887b8c518feca9b75069108c1bd67671af20064"}];
  const size = 131180216;
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
