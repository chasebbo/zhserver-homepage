// Generated v134-8 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-8-handy.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-8-handy.pck.part00","bytes":25165824,"sha256":"93c482e3bdb1efcd818ebfd40a37e1e3cb5ecfe493582a3018e695a66e3a7090"},{"file":"survival-v134-8-handy.pck.part01","bytes":25165824,"sha256":"ae767d426e52ccdada5939fb99dbabe1e3596630d3caa147662aa70415047824"},{"file":"survival-v134-8-handy.pck.part02","bytes":25165824,"sha256":"9c89e2d17043163a6b683bc9cd9730f1dd0b06e0682f275a9c4434d01584d812"},{"file":"survival-v134-8-handy.pck.part03","bytes":25165824,"sha256":"21bff89b41fce76228158359f6a9072e0afcdc2aaf19842e0a70962add17b7c9"},{"file":"survival-v134-8-handy.pck.part04","bytes":25165824,"sha256":"e4c9b36983bee0807e3227f08e03e71c027f2e24acbc6bf5fb3414bbd322317e"},{"file":"survival-v134-8-handy.pck.part05","bytes":7712172,"sha256":"a14622dc81fc16631afcfcd7878001671ed73dc495bf74b4b9f4d88148d44311"}];
  const size = 133541292;
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
