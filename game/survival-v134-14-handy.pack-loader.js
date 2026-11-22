// Generated v134-14 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-14-handy.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-14-handy.pck.part00","bytes":25165824,"sha256":"a8c27d6a9a1b42c65a6c5ecd92f48936ff15fbee815169bfe9292e73d3acd1d0"},{"file":"survival-v134-14-handy.pck.part01","bytes":25165824,"sha256":"e07dc20a19bf0beca6eed4ffc1a492b42fa6224109b21416cc2813cb16acd5eb"},{"file":"survival-v134-14-handy.pck.part02","bytes":25165824,"sha256":"cce6a47b1c00766b8810e0b2b5eaa26f8eaff7c7b896a16689ddc2fd7bf66b49"},{"file":"survival-v134-14-handy.pck.part03","bytes":25165824,"sha256":"d028dd2088cdc3fa4d5b5e5127d6c40d505702094c6b6fd123aab36ecf4907a2"},{"file":"survival-v134-14-handy.pck.part04","bytes":25165824,"sha256":"0a0d50fd01e99139ca774e64042c642be77dbd13c23fd9a24c5195f40f7ce39e"},{"file":"survival-v134-14-handy.pck.part05","bytes":7902168,"sha256":"2d7e09dbf66c876190f2d087ba43e9bef2810de2c7121ea10cd107422e372455"}];
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
