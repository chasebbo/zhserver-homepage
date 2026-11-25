// Generated v134-17 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-17-handy.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-17-handy.pck.part00","bytes":25165824,"sha256":"7841923ba8a3672661ed4865f0e1952ced3b1bd228e0fe698c7da0f613e6a6b7"},{"file":"survival-v134-17-handy.pck.part01","bytes":25165824,"sha256":"8aa85a7a7eae180a5159250a145a6d556a5d6477c3540b58bce17a74d027a7b8"},{"file":"survival-v134-17-handy.pck.part02","bytes":25165824,"sha256":"3ef3531567921f6a2b6aab57402b1298cd954e776bd60f60286496714d21a648"},{"file":"survival-v134-17-handy.pck.part03","bytes":25165824,"sha256":"29b65bebb25a096c20e0ddad4462d189d8164399b1df7dc6f4972014bc172048"},{"file":"survival-v134-17-handy.pck.part04","bytes":25165824,"sha256":"dcf07442bd15fb35b91ce90de388606f387721fbf7c2b1b3ec26a7a00976d3da"},{"file":"survival-v134-17-handy.pck.part05","bytes":20266896,"sha256":"a14d1b60c8cb173907cee6082425758fb41a23be4acdadbbcd113781c6551070"}];
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
