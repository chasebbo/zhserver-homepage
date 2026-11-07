// Generated v132-3 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v132-3-pc.pck', document.baseURI).href;
  const parts = [{"file":"survival-v132-3-pc.pck.part00","bytes":25165824,"sha256":"378f13a4e994fe763d21493fe6419964a97778ec2d428608a88e9ec217cd9ea4"},{"file":"survival-v132-3-pc.pck.part01","bytes":25165824,"sha256":"0cc4df952eafa13b59a829221e71f1b289466e8023669dd50cbe297a14ba8698"},{"file":"survival-v132-3-pc.pck.part02","bytes":25165824,"sha256":"a6047631ba19f992e3f0e2099aa2b27427488dbbbcfd92ea9263fc8e06a6a593"},{"file":"survival-v132-3-pc.pck.part03","bytes":25165824,"sha256":"92ca927f7f07ab0ffd7afb6a1c703d11e10224c06be5f0e729a76d923c10432a"},{"file":"survival-v132-3-pc.pck.part04","bytes":4246692,"sha256":"1b637454e5c6c7c270a5b62609ef0bfad4a8b4ac7ae74ab9664de27896dee405"}];
  const size = 104909988;
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
