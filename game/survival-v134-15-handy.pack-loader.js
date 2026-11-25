// Generated v134-15 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-15-handy.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-15-handy.pck.part00","bytes":25165824,"sha256":"983b72b074018400b15a462fd37f2976f1904a451e76a498fa3d60d9aaa25144"},{"file":"survival-v134-15-handy.pck.part01","bytes":25165824,"sha256":"df1301e9fa2cd059e5e08f4100f754416372b2a998b7f286de92af9037c07906"},{"file":"survival-v134-15-handy.pck.part02","bytes":25165824,"sha256":"b6cac16c5ca52f18370069f674d4a8613b43094b51524739e273f7e41b093ac2"},{"file":"survival-v134-15-handy.pck.part03","bytes":25165824,"sha256":"83f1568bb4856e72f97aebb7cdb1ef67f6ef08685bcf9273bfbb78263e1f9c00"},{"file":"survival-v134-15-handy.pck.part04","bytes":25165824,"sha256":"7c254a1a83b4e445414cf04fa2ea6af7615dbaa96914f3b8390bf8ed989e88cd"},{"file":"survival-v134-15-handy.pck.part05","bytes":20267744,"sha256":"46e5f532d9ffb303588e7b784dcb7c61be43d64eb86c5f6f32ce18c8d8885f48"}];
  const size = 146096864;
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
