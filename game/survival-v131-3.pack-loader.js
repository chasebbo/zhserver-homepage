// Generated v131-3 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v131-3.pck', document.baseURI).href;
  const parts = [{"file":"survival-v131-3.pck.part00","bytes":25165824,"sha256":"a791b721e614818b023519043153363b404a7c605dc5bd902556cdc8fbadd972"},{"file":"survival-v131-3.pck.part01","bytes":25165824,"sha256":"a15b13d3312c56348a73499df320ff93d4177eeafbca9fbc438adad5f1cb01c6"},{"file":"survival-v131-3.pck.part02","bytes":25165824,"sha256":"e690f16dd3d5697985c671dd060174aa453ad55cdd9e6df19468e18ce5214b93"},{"file":"survival-v131-3.pck.part03","bytes":8756800,"sha256":"f15b635b988e7a74db7996e1d74363a3be12302367ce9c207fd608490b0c55d1"}];
  const size = 84254272;
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
