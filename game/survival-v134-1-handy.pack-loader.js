// Generated v134-1 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-1-handy.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-1-handy.pck.part00","bytes":25165824,"sha256":"13263eddf54a2a2a21eb2faf123e0530053131b4be96c666ce0fb73d0aaa6348"},{"file":"survival-v134-1-handy.pck.part01","bytes":25165824,"sha256":"91beceed044c7c039b430f8ac3082d5b33d69e07f4ac3b6b6c084324e37bfb12"},{"file":"survival-v134-1-handy.pck.part02","bytes":25165824,"sha256":"77b2e428ca07ba402cb419110b973f636976663c316f4a4f3db6f360bff4a472"},{"file":"survival-v134-1-handy.pck.part03","bytes":25165824,"sha256":"d447533571dfb83c75187098ae194ce8fe657fec1ecba01c40d5e78095fc9c4b"},{"file":"survival-v134-1-handy.pck.part04","bytes":25165824,"sha256":"f09dee7cdc157f6eb2073ff7740cd4eea6d6f5382e90d03a786e83e6979a15a8"},{"file":"survival-v134-1-handy.pck.part05","bytes":4620084,"sha256":"5d6818871c7ede4e625ed0964556ed9af25d2108308c28bf00ee1ca7ec525a88"}];
  const size = 130449204;
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
