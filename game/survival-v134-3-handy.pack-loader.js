// Generated v134-3 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-3-handy.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-3-handy.pck.part00","bytes":25165824,"sha256":"c16946e2faaf5ff4edac2fd6efb60779b5c197b216694135062e3f12491728df"},{"file":"survival-v134-3-handy.pck.part01","bytes":25165824,"sha256":"91beceed044c7c039b430f8ac3082d5b33d69e07f4ac3b6b6c084324e37bfb12"},{"file":"survival-v134-3-handy.pck.part02","bytes":25165824,"sha256":"77b2e428ca07ba402cb419110b973f636976663c316f4a4f3db6f360bff4a472"},{"file":"survival-v134-3-handy.pck.part03","bytes":25165824,"sha256":"1dd60f577188190caba75c6914fbcc61e07ddb7182776decb5c079500be74ff3"},{"file":"survival-v134-3-handy.pck.part04","bytes":25165824,"sha256":"0cc1f2f697117e6fd7d4085c44787418bc58073cbf70c4a923ede0dfe023e35e"},{"file":"survival-v134-3-handy.pck.part05","bytes":4637732,"sha256":"ff1baad354f5fcf1d84ef2d4b930706f185e3eec3817a21b3d707d87f25b666f"}];
  const size = 130466852;
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
