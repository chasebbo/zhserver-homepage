// Generated probe1 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-probe1-handy.pck', document.baseURI).href;
  const parts = [{"file":"survival-probe1-handy.pck.part00","bytes":25165824,"sha256":"b08782b9d653adfe24fb9ecb8bbb4f1f1456589353fc375f124d37559b09a172"},{"file":"survival-probe1-handy.pck.part01","bytes":25165824,"sha256":"18bdcd84e3d54bf8aae2b284c84e6b2ee9f387095ade3ac8e39beaccacd2322b"},{"file":"survival-probe1-handy.pck.part02","bytes":25165824,"sha256":"9a2a6f42080af33a8f325e80c8fe267b4ae629556d0fa18abf72e01be73d3eb1"},{"file":"survival-probe1-handy.pck.part03","bytes":25165824,"sha256":"f483845bcbba2b288eba7f27ee1a16f59bfccf4a495b23c732545567d26e77d5"},{"file":"survival-probe1-handy.pck.part04","bytes":1043600,"sha256":"84d75734d22a1cc755e81077533363423beb173f5556f5ff117ab9cbbde49830"}];
  const size = 101706896;
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
