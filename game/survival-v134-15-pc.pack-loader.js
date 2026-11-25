// Generated v134-15 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-15-pc.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-15-pc.pck.part00","bytes":25165824,"sha256":"8ec0211529bf5b95a8ff91ab2e245164b8dddf9ec901ff5329d3f6c51adabafe"},{"file":"survival-v134-15-pc.pck.part01","bytes":25165824,"sha256":"7e65c5f9d5f7e3e4d0d8daf7434584075c775ca84a1b18e1904a7c888a738564"},{"file":"survival-v134-15-pc.pck.part02","bytes":25165824,"sha256":"ccd9d09755172aa50b68c391dacb555bacc0b117bf6cf3bf15089f0e4d6557d3"},{"file":"survival-v134-15-pc.pck.part03","bytes":25165824,"sha256":"f413d4208f5314cd11aba79b1fa40151ec4c7a98c0549545858e38b3975b7827"},{"file":"survival-v134-15-pc.pck.part04","bytes":25165824,"sha256":"7c254a1a83b4e445414cf04fa2ea6af7615dbaa96914f3b8390bf8ed989e88cd"},{"file":"survival-v134-15-pc.pck.part05","bytes":20267744,"sha256":"448e988250341663565598f4e5e2e20e3a705f54eb3c4f017a34ba6ea76d0207"}];
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
