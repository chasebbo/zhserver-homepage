// Generated v132-1 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v132-1-pc.pck', document.baseURI).href;
  const parts = [{"file":"survival-v132-1-pc.pck.part00","bytes":25165824,"sha256":"f0bd8c685327887662bc193d4dc2625356f8384db3fae6fe81ba3290d52c12df"},{"file":"survival-v132-1-pc.pck.part01","bytes":25165824,"sha256":"7f113740b6f813dddd2b2d39d4fd8065bcde0c3d058ac38bc2355273df1bc7bc"},{"file":"survival-v132-1-pc.pck.part02","bytes":25165824,"sha256":"08b9e3d682706703e1552fd44c741874c2ac1f2968182e8c262414acf3b60bff"},{"file":"survival-v132-1-pc.pck.part03","bytes":25165824,"sha256":"346d7e0103290c997dbbddf8c51b6c181f54f39318964d0e8545ba2d5d869da5"},{"file":"survival-v132-1-pc.pck.part04","bytes":4244200,"sha256":"d8bcb8165d3c9973721781a5cfc80b32bfe80d5817493f51a39955edb667b58f"}];
  const size = 104907496;
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
