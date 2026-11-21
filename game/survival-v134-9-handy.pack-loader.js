// Generated v134-9 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-9-handy.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-9-handy.pck.part00","bytes":25165824,"sha256":"50b04c7706a97ae5cad432e241a50ff81ddaef08b456dd0c92aa892e37d1bfe1"},{"file":"survival-v134-9-handy.pck.part01","bytes":25165824,"sha256":"062325f9f1610241d05959520808413c92807bb75b0c985b7943e54462b7ec27"},{"file":"survival-v134-9-handy.pck.part02","bytes":25165824,"sha256":"f9c607fb9f105f350a8ef0e41ce3003b347075c5a669abfbcbf67ef6e973de89"},{"file":"survival-v134-9-handy.pck.part03","bytes":25165824,"sha256":"c3880da2f2302d8e310c36a8895af20c9647e9d33c630e30deb137acf9308c7d"},{"file":"survival-v134-9-handy.pck.part04","bytes":25165824,"sha256":"9aa34832b195064d3e9fd53f7fcd2085bf27ca46a816801097898a00fe960c10"},{"file":"survival-v134-9-handy.pck.part05","bytes":7854528,"sha256":"10e02bd8da7bb0736d4fb9b95d9f724c984522208a053bd2559866915c99b60c"}];
  const size = 133683648;
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
