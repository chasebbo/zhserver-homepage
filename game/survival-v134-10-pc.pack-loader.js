// Generated v134-10 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-10-pc.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-10-pc.pck.part00","bytes":25165824,"sha256":"d0abef3d7e09e448d0f311d889278c1c6e153646e0682dc017745d9f8885af97"},{"file":"survival-v134-10-pc.pck.part01","bytes":25165824,"sha256":"e5330ca9898093bb40cab2b916ae63fe65be2de29b3dc777648a2e7ad93743dc"},{"file":"survival-v134-10-pc.pck.part02","bytes":25165824,"sha256":"ecfb10c645ab3494ed8eb3395563462b5e8bcfe8bdc8e9f4f84bea66c6aa5538"},{"file":"survival-v134-10-pc.pck.part03","bytes":25165824,"sha256":"4f0a0b544b16afc0706fd6de26e36388110ff4f18da6eda75270a5d3d3b59e38"},{"file":"survival-v134-10-pc.pck.part04","bytes":25165824,"sha256":"32767840eb2aba0b36546482738e476650d8ed5d1d9f31c881819bf2fb8e9340"},{"file":"survival-v134-10-pc.pck.part05","bytes":7896940,"sha256":"b1967bf9146d8a24780eb6c69bd4950f2c8970dc7dfb44a4cb3d27d483326670"}];
  const size = 133726060;
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
