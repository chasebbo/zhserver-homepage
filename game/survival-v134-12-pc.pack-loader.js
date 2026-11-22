// Generated v134-12 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-12-pc.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-12-pc.pck.part00","bytes":25165824,"sha256":"29dc2fe7851aed5f6d89d75f2816d4737c026e2255571cbfadb45364137e9409"},{"file":"survival-v134-12-pc.pck.part01","bytes":25165824,"sha256":"8bdff81adc012fbc2d182734485126a5ef4762df5f5a89994e575c109ae4111e"},{"file":"survival-v134-12-pc.pck.part02","bytes":25165824,"sha256":"05163f90ecf2cb2a4fd74e6a0f59ea496043273b916f3db66a39e649f12bf4a5"},{"file":"survival-v134-12-pc.pck.part03","bytes":25165824,"sha256":"9bb15df6d7ceb13402bab900d2d89091b3184bebca340dc826b23206ad3fde74"},{"file":"survival-v134-12-pc.pck.part04","bytes":25165824,"sha256":"b68236036e0d108ac252895500d1e20b643007931e9a5be66259e7ac715fc83c"},{"file":"survival-v134-12-pc.pck.part05","bytes":7905656,"sha256":"45d78a76a52e49470dc228727db792d2eee6597fc20017588f12916e37bca3c2"}];
  const size = 133734776;
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
