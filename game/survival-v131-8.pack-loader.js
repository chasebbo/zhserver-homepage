// Generated v131-8 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v131-8.pck', document.baseURI).href;
  const parts = [{"file":"survival-v131-8.pck.part00","bytes":25165824,"sha256":"8d4248424e8163061c8489cff15bed0c766843b2ecd916612ec3f2fb97cac051"},{"file":"survival-v131-8.pck.part01","bytes":25165824,"sha256":"9325f7d131d9bac9d86c1a7e79d1b53684afb3f0a99fc8ac664959a029ee5330"},{"file":"survival-v131-8.pck.part02","bytes":25165824,"sha256":"d4414e6fe49d69a4d40e0e6d957b0c388cc74e4d5fe3f992627d7ea3770f5eef"},{"file":"survival-v131-8.pck.part03","bytes":25165824,"sha256":"560132c407fa012b58ee0d2fa251a7beee3f17492360bb4592be51c914e98a16"},{"file":"survival-v131-8.pck.part04","bytes":7208616,"sha256":"1c6b5d59de92b3d8306b37628a90b8b48c1dc2b2d1af9286f739c969bfc09d5b"}];
  const size = 107871912;
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
