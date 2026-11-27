/* Gemeinsames Hochladen von Bildern (Galerie und Forum, 27.11.2026).
   Ein Speicher: der öffentliche Bucket "gallery", Dateiname <uuid>.<png|jpg|webp>, höchstens 5 MB.
   Das entspricht der bestehenden Speicherregel "Öffentliche Uploads in gallery"; kein zweites System. */
(() => {
    "use strict";
    if (window.ZHBildHochladen) return;
    const BUCKET = "gallery";
    const MAX_BYTES = 5 * 1024 * 1024;
    const TYPES = new Map([["image/png", "png"], ["image/jpeg", "jpg"], ["image/webp", "webp"]]);
    const NAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png|jpg|webp)$/;
    // Größere Fotos (etwa vom Handy) werden vor dem Hochladen verkleinert, die lange Seite auf höchstens so viele Pixel.
    const MAX_SIDE = 2048;

    const encode = (canvas, type, quality) => new Promise(resolve => canvas.toBlob(resolve, type, quality));

    // Liefert ein Bild, das die Speicherregel erfüllt, oder wirft "image.invalid".
    // shrink=false: unverändert prüfen wie bisher in der Galerie.
    async function prepare(file, { shrink = true } = {}) {
        if (!file || typeof file.size !== "number") throw new Error("image.invalid");
        const type = TYPES.get(file.type);
        if (!shrink) {
            if (!type || file.size > MAX_BYTES) throw new Error("image.invalid");
            return { blob: file, extension: type };
        }
        let bitmap;
        try { bitmap = await createImageBitmap(file, { imageOrientation: "from-image" }); }
        catch (_) { try { bitmap = await createImageBitmap(file); } catch (_) { throw new Error("image.invalid"); } }
        try {
            const { width, height } = bitmap;
            if (!width || !height) throw new Error("image.invalid");
            const small = Math.max(width, height) <= MAX_SIDE;
            if (type && small && file.size <= MAX_BYTES) return { blob: file, extension: type };
            const scale = Math.min(1, MAX_SIDE / Math.max(width, height));
            const canvas = document.createElement("canvas");
            canvas.width = Math.max(1, Math.round(width * scale)); canvas.height = Math.max(1, Math.round(height * scale));
            canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
            for (const quality of [0.86, 0.75, 0.6]) {
                let blob = await encode(canvas, "image/webp", quality);
                if (!blob || blob.type !== "image/webp") blob = await encode(canvas, "image/jpeg", quality);
                if (blob && blob.size <= MAX_BYTES && TYPES.has(blob.type)) return { blob, extension: TYPES.get(blob.type) };
            }
            throw new Error("image.invalid");
        } finally { bitmap.close?.(); }
    }

    // Lädt in den Bucket "gallery" und gibt Dateiname und öffentliche Adresse zurück.
    async function upload(client, blob, extension) {
        if (!client?.storage) throw new Error("image.failed");
        const name = `${crypto.randomUUID()}.${extension}`;
        const contentType = [...TYPES].find(([, ext]) => ext === extension)?.[0];
        if (!contentType || !NAME.test(name)) throw new Error("image.invalid");
        const { error } = await client.storage.from(BUCKET).upload(name, blob, { cacheControl: "31536000", contentType, upsert: false });
        if (error) throw error;
        return { name, url: client.storage.from(BUCKET).getPublicUrl(name).data.publicUrl };
    }

    // Öffentliche Adresse eines vorhandenen Dateinamens, nur für Namen nach der Speicherregel.
    function urlFor(client, name) {
        if (typeof name !== "string" || !NAME.test(name) || !client?.storage) return null;
        return client.storage.from(BUCKET).getPublicUrl(name).data.publicUrl;
    }

    window.ZHBildHochladen = Object.freeze({ MAX_BYTES, TYPES, NAME, prepare, upload, urlFor });
})();
