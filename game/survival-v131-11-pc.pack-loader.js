// Generated v131-11 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v131-11-pc.pck', document.baseURI).href;
  const parts = [{"file":"survival-v131-11-pc.pck.part00","bytes":25165824,"sha256":"e87931c4914fccf7bc49d7a6ba473f788d34277dbe004bb15b4f4bedd399a5af"},{"file":"survival-v131-11-pc.pck.part01","bytes":25165824,"sha256":"c96fc5c46decf67f10da6b907a7204638956674724f11fd581fcc6d5f1ba92fc"},{"file":"survival-v131-11-pc.pck.part02","bytes":25165824,"sha256":"cf43bbea79b517419064acbf40b65e41648ecefefad7b362efa59b2d938c7020"},{"file":"survival-v131-11-pc.pck.part03","bytes":25165824,"sha256":"ee5e9e609f7137135b0472564b71573674f5b32ab434241c016f10be73dc93a7"},{"file":"survival-v131-11-pc.pck.part04","bytes":8407164,"sha256":"6caf6ca30dd23550fb24659805761272d7b07ec17c19970cdf057f0c29143b59"}];
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
