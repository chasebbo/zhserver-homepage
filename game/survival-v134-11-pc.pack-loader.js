// Generated v134-11 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-11-pc.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-11-pc.pck.part00","bytes":25165824,"sha256":"c2389dbec6b872cdf508cf37a26174cc55a871fb116df3e079f88b3378a84288"},{"file":"survival-v134-11-pc.pck.part01","bytes":25165824,"sha256":"d99a521d7d892f17474bfbde01d2b5cd0cb93dc9667617bf593dae75b68a15e1"},{"file":"survival-v134-11-pc.pck.part02","bytes":25165824,"sha256":"4dfca6a5d0c9d8a058ef7fe38912af01095adeb42a146d5d25c1af9fe5b88556"},{"file":"survival-v134-11-pc.pck.part03","bytes":25165824,"sha256":"de66b1e13e051eea5bc460e976d7dc8b5f9d7fd9a46c46264d30d1cdf5134efc"},{"file":"survival-v134-11-pc.pck.part04","bytes":25165824,"sha256":"917f4a0774bdb9cf590dce18825647e6a56e38b480e352c4dfc46fcab17c7ec3"},{"file":"survival-v134-11-pc.pck.part05","bytes":7902408,"sha256":"52fe1e4e946bd10b525a05a67bf87a0651f60ad32c1a64797249e2ad563a1d89"}];
  const size = 133731528;
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
