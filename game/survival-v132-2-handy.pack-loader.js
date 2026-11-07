// Generated v132-2 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v132-2-handy.pck', document.baseURI).href;
  const parts = [{"file":"survival-v132-2-handy.pck.part00","bytes":25165824,"sha256":"73a502a26240d53749412c8a19b89cefaab306fca9232e1c971d8fe3e39eded0"},{"file":"survival-v132-2-handy.pck.part01","bytes":25165824,"sha256":"e88dbfb4702d1cef43db59070569a5b9e2e15ad43f20110148ac09810004d378"},{"file":"survival-v132-2-handy.pck.part02","bytes":25165824,"sha256":"9614746573f007227ff376b606cf23136b651a1e8fb2efaafa924bbf4d14aa0a"},{"file":"survival-v132-2-handy.pck.part03","bytes":25165824,"sha256":"b8dac526e240e3d2fd1c66f924e0b38639f90913eeaa1f55403de5bac79d3329"},{"file":"survival-v132-2-handy.pck.part04","bytes":4247812,"sha256":"c8290b99c473a969a17ff6ae152664861951ed59356efd3138b63c30a3cf2809"}];
  const size = 104911108;
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
