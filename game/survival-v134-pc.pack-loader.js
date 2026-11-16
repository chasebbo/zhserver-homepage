// Generated v134 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-pc.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-pc.pck.part00","bytes":25165824,"sha256":"88d84ac5075fb8426afc1c90ba9366b056eef772fb3eb22acaf465f797d8d9fa"},{"file":"survival-v134-pc.pck.part01","bytes":25165824,"sha256":"0d5a6b7fd51ce7120dfa9126b505c4cec20c7357ec1db5f4c53db8992424fefd"},{"file":"survival-v134-pc.pck.part02","bytes":25165824,"sha256":"b39e43f732cacc324f567fc4e5ddcc69b344638e75e99338c49077ea3bad61bb"},{"file":"survival-v134-pc.pck.part03","bytes":25165824,"sha256":"d0e0ad58922e328d20830765ff2ab1839936ccc8748311194a8cf2f1b97bcd15"},{"file":"survival-v134-pc.pck.part04","bytes":25165824,"sha256":"2aaaa062b3def3d1c0e846dcb0764346d26da52f2b3611ea573ee8e6999a42ce"},{"file":"survival-v134-pc.pck.part05","bytes":4627828,"sha256":"7721c9dda57a83a45087860529cafcb37c2d564e7c413927c2fd782b571da525"}];
  const size = 130456948;
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
