// Generated v132-1 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v132-1-handy.pck', document.baseURI).href;
  const parts = [{"file":"survival-v132-1-handy.pck.part00","bytes":25165824,"sha256":"6a5878ecd3886e61d476ec15698016eda272425f2f21a8759b97092fd43efc57"},{"file":"survival-v132-1-handy.pck.part01","bytes":25165824,"sha256":"f33c08b680be3333515a59a494f52e2cb498a2eacf4200c2a2827b6577bea7bd"},{"file":"survival-v132-1-handy.pck.part02","bytes":25165824,"sha256":"b545383cd47b518e296fd412906d38ebedd7dff9218a093f03914a8f077930ab"},{"file":"survival-v132-1-handy.pck.part03","bytes":25165824,"sha256":"09a5db0a6f55c55d04c2897ca66895d842b2fb682023bdc8b11dd3d50df618ad"},{"file":"survival-v132-1-handy.pck.part04","bytes":4244200,"sha256":"3237d675a750150a756616a2f3bf58b2ba02d9b14145b32a70df0056b5fe01aa"}];
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
