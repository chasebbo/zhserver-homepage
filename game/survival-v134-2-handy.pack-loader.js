// Generated v134-2 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-2-handy.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-2-handy.pck.part00","bytes":25165824,"sha256":"35b00c715bf5807105608f3bff3368e01119e012886212853d249cc2a233dd30"},{"file":"survival-v134-2-handy.pck.part01","bytes":25165824,"sha256":"91beceed044c7c039b430f8ac3082d5b33d69e07f4ac3b6b6c084324e37bfb12"},{"file":"survival-v134-2-handy.pck.part02","bytes":25165824,"sha256":"77b2e428ca07ba402cb419110b973f636976663c316f4a4f3db6f360bff4a472"},{"file":"survival-v134-2-handy.pck.part03","bytes":25165824,"sha256":"1dd60f577188190caba75c6914fbcc61e07ddb7182776decb5c079500be74ff3"},{"file":"survival-v134-2-handy.pck.part04","bytes":25165824,"sha256":"b1e2f3f4f9ad0f77a7366793e4747085bdd9966b927df68ca56f566df31aba84"},{"file":"survival-v134-2-handy.pck.part05","bytes":4627576,"sha256":"9d7b084ad7a6999db94d7a7bcd1e027088d50da11b8f671d9f32ddb28106f284"}];
  const size = 130456696;
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
