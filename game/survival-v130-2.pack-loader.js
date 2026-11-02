// Generated v130-2 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v130-2.pck', document.baseURI).href;
  const parts = [{"file":"survival-v130-2.pck.part00","bytes":25165824,"sha256":"f9ddf59ea9942002790a05e739e6f50ff09a20e5d8079f979dcf3be1ea35212a"},{"file":"survival-v130-2.pck.part01","bytes":25165824,"sha256":"4f3c3b93e2e3a25733d04bed5be33413f8817d4c02e5c13ffa601af035b4db7a"},{"file":"survival-v130-2.pck.part02","bytes":25165824,"sha256":"039c1b2b7e35e2ebef6ee014c6c270e2184e4bb9ecc9a2f5c9c7b1112796516e"},{"file":"survival-v130-2.pck.part03","bytes":8633884,"sha256":"75eec69ec29ce8275c443d0d40befa81b10bd40d50942a38eb68a30d10a944a6"}];
  const size = 84131356;
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
