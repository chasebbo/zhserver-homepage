// Generated v134-8 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-8-pc.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-8-pc.pck.part00","bytes":25165824,"sha256":"3b999139a0228604a1e5aa1bda01fd29989577dd3d58c91eee62e8000f02a1b2"},{"file":"survival-v134-8-pc.pck.part01","bytes":25165824,"sha256":"0068df247718f4d35da0ee445732c974b0c04aa2e310e24e82d5b6e3cf119b7b"},{"file":"survival-v134-8-pc.pck.part02","bytes":25165824,"sha256":"6247a583bf49fabffa501e6e5aad286d83af31cfa0d343166811b4ae73c00822"},{"file":"survival-v134-8-pc.pck.part03","bytes":25165824,"sha256":"1b98ae02873813fa8724459b19f16b649c299ecf1c90da33af699f7eaa5ad9f7"},{"file":"survival-v134-8-pc.pck.part04","bytes":25165824,"sha256":"e4c9b36983bee0807e3227f08e03e71c027f2e24acbc6bf5fb3414bbd322317e"},{"file":"survival-v134-8-pc.pck.part05","bytes":7712172,"sha256":"0aa1bc534cfdc22134e7383ce7d0b273888f0b7bd8a76448f7b03f05fecabea6"}];
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
