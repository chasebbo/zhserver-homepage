// Generated v131-11 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v131-11-handy.pck', document.baseURI).href;
  const parts = [{"file":"survival-v131-11-handy.pck.part00","bytes":25165824,"sha256":"81985e20c4ad10643e86be77fc1b89173dee1913c3c2c170417dcdd3ebfcdb19"},{"file":"survival-v131-11-handy.pck.part01","bytes":25165824,"sha256":"e498982b16a347d333d1817f1c70c5032f8bb094cd544159c6203289dc1d2492"},{"file":"survival-v131-11-handy.pck.part02","bytes":25165824,"sha256":"fd8527ce1b603bdf87228234f9a5946bfcf98e6a439dfda820aef75a67a52f56"},{"file":"survival-v131-11-handy.pck.part03","bytes":25165824,"sha256":"0577652f06b04def46bc01aa1c990dfd46b52e21da51e7e0ebda8ef1726699fa"},{"file":"survival-v131-11-handy.pck.part04","bytes":8407164,"sha256":"6fe98f06472ec55ea4d9812e2f6135cb06c29d718937e73345afe7746acac0d6"}];
  const size = 109070460;
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
