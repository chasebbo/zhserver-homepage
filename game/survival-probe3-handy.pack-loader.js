// Generated probe3 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-probe3-handy.pck', document.baseURI).href;
  const parts = [{"file":"survival-probe3-handy.pck.part00","bytes":25165824,"sha256":"84c43b22b5ef003ee1213ff728297dd94f20651a18e0e45692f1999943ad8e69"},{"file":"survival-probe3-handy.pck.part01","bytes":25165824,"sha256":"4b81a754d3fd6f3e0b00fb8afa472c772a7132a941a03692613e991a7c1e0507"},{"file":"survival-probe3-handy.pck.part02","bytes":25165824,"sha256":"9c8bd909958919ca01d6f624e172c4bb86a2391d0a6f4515fdcfc791d125af58"},{"file":"survival-probe3-handy.pck.part03","bytes":25165824,"sha256":"7cf374ff9a0f60815f580f168d9cc0ea3cc2d3ad6c0209e6b3bf1f14a2314c30"},{"file":"survival-probe3-handy.pck.part04","bytes":3892440,"sha256":"cb56153d31132c00b3d7c6206ca8b2c3d60a991717883c7fa8bfc28b0853a85f"}];
  const size = 104555736;
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
