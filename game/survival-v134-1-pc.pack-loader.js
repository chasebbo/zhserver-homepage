// Generated v134-1 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-1-pc.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-1-pc.pck.part00","bytes":25165824,"sha256":"7b70925a5958d663db6a34279b8a60524374702da6b4c485446e3e5bf5bb120a"},{"file":"survival-v134-1-pc.pck.part01","bytes":25165824,"sha256":"9e316018e04a77b524d6a16f2df947506c47b90fe20ded789574cf8ce035e7e5"},{"file":"survival-v134-1-pc.pck.part02","bytes":25165824,"sha256":"8885d0140460364beb778353a16b66812fae9090d6bb4a412ce12f48623b7345"},{"file":"survival-v134-1-pc.pck.part03","bytes":25165824,"sha256":"3a049df3d4e1c6ef5fc3a9200e4a507ec30c8f4895ab219e554cb170d324106e"},{"file":"survival-v134-1-pc.pck.part04","bytes":25165824,"sha256":"f09dee7cdc157f6eb2073ff7740cd4eea6d6f5382e90d03a786e83e6979a15a8"},{"file":"survival-v134-1-pc.pck.part05","bytes":4620084,"sha256":"2005deabede3c29ad4df6be52af235b199542b05a3c5e8376222afbde1f3d689"}];
  const size = 130449204;
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
