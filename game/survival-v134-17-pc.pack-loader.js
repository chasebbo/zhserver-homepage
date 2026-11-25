// Generated v134-17 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-17-pc.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-17-pc.pck.part00","bytes":25165824,"sha256":"fb07718f638352eea59a547cacac554c57ad877319118714b89970aa9186cffc"},{"file":"survival-v134-17-pc.pck.part01","bytes":25165824,"sha256":"1947ab4dc5fbfd7dc8fe69aa63496cb96e8536c102584272cb8610f6153f9eaa"},{"file":"survival-v134-17-pc.pck.part02","bytes":25165824,"sha256":"20da124cf74abbe16e756dc9b6dff5884934fdabd08d6e9228f5198ed6743f60"},{"file":"survival-v134-17-pc.pck.part03","bytes":25165824,"sha256":"b9450480ded917b733486a48ff6ecdbb9f0f1d79a0de5350d311032fe3e5e0ba"},{"file":"survival-v134-17-pc.pck.part04","bytes":25165824,"sha256":"dcf07442bd15fb35b91ce90de388606f387721fbf7c2b1b3ec26a7a00976d3da"},{"file":"survival-v134-17-pc.pck.part05","bytes":20266896,"sha256":"dacea88314412eae441b00c68fc0a8a47cf1757e1c866b79bc8162406b55e7ee"}];
  const size = 146096016;
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
