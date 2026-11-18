// Generated v134-6 delivery adapter. Only the virtual main pack is intercepted.
// Every part is below GitHub's 100-MiB limit. The Godot pack bytes stay unchanged.
(() => {
  const pack = new URL('survival-v134-6-handy.pck', document.baseURI).href;
  const parts = [{"file":"survival-v134-6-handy.pck.part00","bytes":25165824,"sha256":"8f6c410513fa5027bfe1bec43d1707858f2b9d43b8e21eea08997fc023ec8454"},{"file":"survival-v134-6-handy.pck.part01","bytes":25165824,"sha256":"c9b8366b7f3dffe9ee078ccde203e9970557a73fe51cae683546799de04112c8"},{"file":"survival-v134-6-handy.pck.part02","bytes":25165824,"sha256":"def263855a0c6b9ab0d743610c2a1c4c4b6746cc7ad3d93d34aa0886f2f0976d"},{"file":"survival-v134-6-handy.pck.part03","bytes":25165824,"sha256":"43a947a0b218404b7adc41c21c82af10504485effccb6ade21766241f1239846"},{"file":"survival-v134-6-handy.pck.part04","bytes":25165824,"sha256":"17e9082ef989d719fa3d548eaccc00cd9a93c74c873d26f793f0e9fad3a2d974"},{"file":"survival-v134-6-handy.pck.part05","bytes":5351096,"sha256":"93a4e74ef4cdd7070ce13b4f261da7cd075bfd47dc10ccd584a328a50849e7dc"}];
  const size = 131180216;
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
