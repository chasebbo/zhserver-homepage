// Generated v132-3 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v132-3-handy.pck', document.baseURI).href;
  const parts = [{"file":"survival-v132-3-handy.pck.part00","bytes":25165824,"sha256":"37b33bad7e4b57da586ad676d1c94c7b84ed5a62ad0c3e0989c2f3b917430332"},{"file":"survival-v132-3-handy.pck.part01","bytes":25165824,"sha256":"c06edac79fadfa5cb0016b6f92399d4fd3d450524e9d57efc05a638596fac22a"},{"file":"survival-v132-3-handy.pck.part02","bytes":25165824,"sha256":"f13ce6bc36542e4b0dfefcb4c3e4939763910da7d493cc54ec03cae603e35906"},{"file":"survival-v132-3-handy.pck.part03","bytes":25165824,"sha256":"1fc7a94341c1c1f53a4be6e418b3f0c58177d44f0a7fea5f0f3c57f697b9c169"},{"file":"survival-v132-3-handy.pck.part04","bytes":4246692,"sha256":"6995af0c6de2c4d462db8586a17df3f0d77d79c70994d8158ba314112ead0572"}];
  const size = 104909988;
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
