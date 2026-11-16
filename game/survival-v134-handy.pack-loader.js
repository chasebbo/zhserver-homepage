// Generated v134 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-handy.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-handy.pck.part00","bytes":25165824,"sha256":"e8c504ee806dbaad8bea238de2e75352fb406c7e7e73d00e1238c727fbc7234f"},{"file":"survival-v134-handy.pck.part01","bytes":25165824,"sha256":"18b9e9a96d155cfa76168a6428b20463aa1fb5cc6641b6654863f600cda04956"},{"file":"survival-v134-handy.pck.part02","bytes":25165824,"sha256":"423854881139c5d6d3d32d6d5ccd82d35fbca01dc630c345e6c4725c43118d02"},{"file":"survival-v134-handy.pck.part03","bytes":25165824,"sha256":"cf8292abd787694e69e3bd1d6038e9cc41c255db0b01af2971c1527b1e388d0f"},{"file":"survival-v134-handy.pck.part04","bytes":25165824,"sha256":"2aaaa062b3def3d1c0e846dcb0764346d26da52f2b3611ea573ee8e6999a42ce"},{"file":"survival-v134-handy.pck.part05","bytes":4627828,"sha256":"1810b8bf1402c997c661ded4e77e0cd35670e46f58dd6c93a372521fa67c00ec"}];
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
