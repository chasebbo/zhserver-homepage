// Generated v133 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v133-handy.pck', document.baseURI).href;
  const parts = [{"file":"survival-v133-handy.pck.part00","bytes":25165824,"sha256":"23a26d4560b021a09ed181771c1fd189a129fdc727fc9fd354351c0d7ca33234"},{"file":"survival-v133-handy.pck.part01","bytes":25165824,"sha256":"0c0ad631717b8398cf8cb200cd6c59ad3228ea3e48943ae9c5397d77a046af83"},{"file":"survival-v133-handy.pck.part02","bytes":25165824,"sha256":"c9fc787fcf8805cc60cae09318c6d6cf208afe9821afbe15f388444f76d03a30"},{"file":"survival-v133-handy.pck.part03","bytes":25165824,"sha256":"56d8be7d38dbf6dd3465822b35844dfdcd6d374ce5c297bcc8f2b2aeff43d89b"},{"file":"survival-v133-handy.pck.part04","bytes":25165824,"sha256":"b9876277c5a1246a945be928325b1e40ca63648f6e66f436730a9c28ebc58ffe"},{"file":"survival-v133-handy.pck.part05","bytes":7200308,"sha256":"2e0794a4947d9b4ab28056834508c8d8a238dd7a383f3eb8e04dcadeb11133a0"}];
  const size = 133029428;
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
