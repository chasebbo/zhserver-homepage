// Generated v132-2 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v132-2-pc.pck', document.baseURI).href;
  const parts = [{"file":"survival-v132-2-pc.pck.part00","bytes":25165824,"sha256":"0d5412f97bab517c955c9caef40d6512f6c05aa35f38a167fb7d2bf4b6033165"},{"file":"survival-v132-2-pc.pck.part01","bytes":25165824,"sha256":"8ed2db6589ccaa60fbbb4d6272d6644d6038b9f40db4cde3521b78ec8894f783"},{"file":"survival-v132-2-pc.pck.part02","bytes":25165824,"sha256":"da97491349f3bb152055783de5143c60ca3cafdbb0a3067283569cc22f7e15ed"},{"file":"survival-v132-2-pc.pck.part03","bytes":25165824,"sha256":"c027f2944e8d6a58a2596ce46239439cfa863db1b9f6a84a7d1266b1ca1c0e0f"},{"file":"survival-v132-2-pc.pck.part04","bytes":4247812,"sha256":"433e8dc2c3dfa58629c919a7934a52dc4ce294a141a1950d6e2cce7ef9615902"}];
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
