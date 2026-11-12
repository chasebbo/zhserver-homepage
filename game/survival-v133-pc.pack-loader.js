// Generated v133 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v133-pc.pck', document.baseURI).href;
  const parts = [{"file":"survival-v133-pc.pck.part00","bytes":25165824,"sha256":"f50d3da6702e604d7de3d404cea6eb499dd08ba345df219e1703418e29f9d59b"},{"file":"survival-v133-pc.pck.part01","bytes":25165824,"sha256":"e06c1a26750ae7d3c5764bdc491bd169b61aaf4a05c8dc1f4ad3cfda143f8e04"},{"file":"survival-v133-pc.pck.part02","bytes":25165824,"sha256":"7408abb56eac9fd1c4d30c3a4709de07451285705489fb1f28b1c8308d17f387"},{"file":"survival-v133-pc.pck.part03","bytes":25165824,"sha256":"c53b44a9fe657a1af2a5d91ef111870fb95bd0b0425f3de0b7db4ac03c871921"},{"file":"survival-v133-pc.pck.part04","bytes":25165824,"sha256":"b9876277c5a1246a945be928325b1e40ca63648f6e66f436730a9c28ebc58ffe"},{"file":"survival-v133-pc.pck.part05","bytes":7200308,"sha256":"0d00c16f01ca33fe2b243d097f54f32a6e53484990fe8df4bc54af8c918ae0bb"}];
  const size = 133029428;
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
