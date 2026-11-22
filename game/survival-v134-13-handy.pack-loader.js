// Generated v134-13 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-13-handy.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-13-handy.pck.part00","bytes":25165824,"sha256":"0b06aa5d72899a2973de10f536429aa16dd03fa61f7573a071ed5f4fcd8e62d3"},{"file":"survival-v134-13-handy.pck.part01","bytes":25165824,"sha256":"f4bf0876a87e3176149249fb8f37ee4c8ec908d9bb3fe7ceef095824131c6516"},{"file":"survival-v134-13-handy.pck.part02","bytes":25165824,"sha256":"d3f55bf06e2e3b3d0c9390dde29d480f38c2ef9e4cf5e4ea75c8b4770658a57a"},{"file":"survival-v134-13-handy.pck.part03","bytes":25165824,"sha256":"46855da6d184d7a57cb8bc8b906125d6c3029dd13a1638775b0c6d97df67cb47"},{"file":"survival-v134-13-handy.pck.part04","bytes":25165824,"sha256":"b68236036e0d108ac252895500d1e20b643007931e9a5be66259e7ac715fc83c"},{"file":"survival-v134-13-handy.pck.part05","bytes":7905880,"sha256":"377b84a3497ac26e6b3367015c4dce64979ef8bb26397bcafa7d1ad647d0ba8d"}];
  const size = 133735000;
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
