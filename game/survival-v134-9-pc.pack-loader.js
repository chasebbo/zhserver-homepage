// Generated v134-9 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-9-pc.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-9-pc.pck.part00","bytes":25165824,"sha256":"0f7a083be9a5030fbed0a7df1c73a161c14d4573ba0373c8f0561d7730d6e399"},{"file":"survival-v134-9-pc.pck.part01","bytes":25165824,"sha256":"6d0a8d565db8112a59d85fa0d85566fc1895f4b82714ef2b8a60b0d0406bccc7"},{"file":"survival-v134-9-pc.pck.part02","bytes":25165824,"sha256":"4bc0da5cde79e0f99a2b44c6f56a0dd5fd4e196176894e4a5cf714cbdd63ec56"},{"file":"survival-v134-9-pc.pck.part03","bytes":25165824,"sha256":"9207a318e7c66c656f38ae3c07bb65b9f0f662bd43f274135b1bcedb16dcb33a"},{"file":"survival-v134-9-pc.pck.part04","bytes":25165824,"sha256":"9aa34832b195064d3e9fd53f7fcd2085bf27ca46a816801097898a00fe960c10"},{"file":"survival-v134-9-pc.pck.part05","bytes":7854528,"sha256":"44476c9e8329a2f8421fda846c30eec5f3d352fe9fde6aa9039b0bb68785a6d6"}];
  const size = 133683648;
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
