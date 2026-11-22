// Generated v134-11 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-11-handy.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-11-handy.pck.part00","bytes":25165824,"sha256":"a775e27fc64f1b4ac114f75b26ff52a101dc604042efa72086482bad81834468"},{"file":"survival-v134-11-handy.pck.part01","bytes":25165824,"sha256":"b3c6b3ead6645fe2c3f38ca8699f719009f18dd32e082b2776fb94cd84c5a9f0"},{"file":"survival-v134-11-handy.pck.part02","bytes":25165824,"sha256":"bf86607d1719e668e4ad7cd9ee5a77ee62c584829a2c5ca8830be8cffeae486b"},{"file":"survival-v134-11-handy.pck.part03","bytes":25165824,"sha256":"5876415aaa6dde29754dbf8ba3fa76cc198f2110330615de91878484617adcc0"},{"file":"survival-v134-11-handy.pck.part04","bytes":25165824,"sha256":"917f4a0774bdb9cf590dce18825647e6a56e38b480e352c4dfc46fcab17c7ec3"},{"file":"survival-v134-11-handy.pck.part05","bytes":7902408,"sha256":"19e0841990c8696f4e5cbf6f40fc8747fdd8c5b3ff741f9cd6761062e5650028"}];
  const size = 133731528;
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
