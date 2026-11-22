// Generated v134-14 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-14-pc.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-14-pc.pck.part00","bytes":25165824,"sha256":"1a6b550ef02b152c6e73a4e392fe97bc4863222b88814c110a8d6345ec356794"},{"file":"survival-v134-14-pc.pck.part01","bytes":25165824,"sha256":"5ee745263d6671778c0fb431228db2ebb0cf1a23ba1bb6a56ae9e0c828890199"},{"file":"survival-v134-14-pc.pck.part02","bytes":25165824,"sha256":"35275b0ebce5576f35594e9142f1e11caf9775da178d84325623433dfa65328d"},{"file":"survival-v134-14-pc.pck.part03","bytes":25165824,"sha256":"dd14395796ca1849487db47b04afaa886ba9dbc035eb269fe20b376d47074628"},{"file":"survival-v134-14-pc.pck.part04","bytes":25165824,"sha256":"0a0d50fd01e99139ca774e64042c642be77dbd13c23fd9a24c5195f40f7ce39e"},{"file":"survival-v134-14-pc.pck.part05","bytes":7902168,"sha256":"d7fde73de0d2b7c8802bfc93b4a2dfd5e1b03e56f22328597341d67088472306"}];
  const size = 133731288;
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
