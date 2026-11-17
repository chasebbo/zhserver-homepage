// Generated v134-3 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-3-pc.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-3-pc.pck.part00","bytes":25165824,"sha256":"95c8f55768b946d7b6c799264dcc7455dda877d3e8d1bfe9521021ddaf8ca4e1"},{"file":"survival-v134-3-pc.pck.part01","bytes":25165824,"sha256":"9e316018e04a77b524d6a16f2df947506c47b90fe20ded789574cf8ce035e7e5"},{"file":"survival-v134-3-pc.pck.part02","bytes":25165824,"sha256":"8885d0140460364beb778353a16b66812fae9090d6bb4a412ce12f48623b7345"},{"file":"survival-v134-3-pc.pck.part03","bytes":25165824,"sha256":"4003a6fff23dcecce9d302673f4a9e951c2528c3464622a8380bf4e24e0e8ecd"},{"file":"survival-v134-3-pc.pck.part04","bytes":25165824,"sha256":"0cc1f2f697117e6fd7d4085c44787418bc58073cbf70c4a923ede0dfe023e35e"},{"file":"survival-v134-3-pc.pck.part05","bytes":4637732,"sha256":"d32dc5e884082b4697db1b2199346c0b448f9c2973cd9b862b5b1e4d0b4f1c8e"}];
  const size = 130466852;
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
