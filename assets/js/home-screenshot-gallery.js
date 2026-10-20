/* Landingpage screenshots only. No account, game, forum or backend access. */
(() => {
    'use strict';
    const root = document.querySelector('.home-page .era-screenshot-collage');
    const dialog = document.getElementById('home-screenshot-dialog');
    const language = window.ZHLanguage;
    if (!root || !dialog || !language || typeof dialog.showModal !== 'function') return;
    const openButton = root.querySelector('[data-screenshot-open]');
    const thumbs = [...root.querySelectorAll('[data-screenshot-full]')];
    const shots = thumbs.map(button => ({
        full: button.dataset.screenshotFull,
        preview: button.querySelector('img').getAttribute('src'),
        description: button.dataset.screenshotDescription
    }));
    const layers = [openButton.querySelector('img'), openButton.querySelector('img').cloneNode()];
    layers[0].classList.add('is-current');
    layers[1].removeAttribute('src');
    layers[1].removeAttribute('srcset');
    layers[1].removeAttribute('fetchpriority');
    layers[1].alt = '';
    layers[1].setAttribute('aria-hidden', 'true');
    openButton.append(layers[1]);
    const lightboxImage = dialog.querySelector('.screenshot-dialog-image');
    const caption = dialog.querySelector('.screenshot-dialog-caption');
    const position = dialog.querySelector('.screenshot-position');
    const closeButton = dialog.querySelector('[data-screenshot-close]');
    const previous = dialog.querySelector('[data-screenshot-prev]');
    const next = dialog.querySelector('[data-screenshot-next]');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0, front = 0, request = 0, lightboxRequest = 0, timer = 0;
    let manualUntil = 0, hovering = false, savedScroll = null, bodyStyles = null;
    let swipe = null;
    const description = shot => window.ZHTranslations.copy[shot.description][language.language];

    function labels() {
        thumbs.forEach((button, i) => {
            button.setAttribute('aria-pressed', String(i === index));
            button.setAttribute('aria-label', language.t('screenshots.select', {number: i + 1, description: description(shots[i])}));
        });
        layers[front].alt = description(shots[index]);
        openButton.setAttribute('aria-label', language.t('screenshots.open', {description: description(shots[index])}));
        language.bind(previous, 'gallery.lightbox.previous', {}, 'aria-label');
        language.bind(next, 'gallery.lightbox.next', {}, 'aria-label');
        language.bind(closeButton, 'screenshots.close', {}, 'aria-label');
        if (dialog.open) {
            language.bind(position, 'gallery.lightbox.position', {current: index + 1, total: shots.length});
            caption.textContent = description(shots[index]);
            lightboxImage.alt = description(shots[index]);
        }
    }

    function schedule() {
        clearTimeout(timer);
        if (document.hidden || dialog.open || motion.matches || hovering || root.querySelector(':focus-visible')) return;
        timer = setTimeout(() => select(index + 1), Math.max(6000, manualUntil - Date.now()));
    }

    async function select(target, manual = false) {
        if (manual) manualUntil = Date.now() + 30000;
        clearTimeout(timer);
        const selected = (target + shots.length) % shots.length;
        const token = ++request;
        if (selected !== index) {
            const back = 1 - front;
            const image = layers[back];
            image.classList.remove('is-current');
            image.alt = '';
            image.setAttribute('aria-hidden', 'true');
            image.removeAttribute('srcset');
            image.src = shots[selected].preview;
            try { await image.decode(); } catch (_) { schedule(); return; }
            if (token !== request) return;
            layers[front].classList.remove('is-current');
            layers[front].setAttribute('aria-hidden', 'true');
            image.classList.add('is-current');
            image.removeAttribute('aria-hidden');
            front = back;
            index = selected;
        }
        labels();
        if (dialog.open) renderLightbox();
        schedule();
    }

    async function renderLightbox() {
        const token = ++lightboxRequest;
        lightboxImage.classList.add('is-loading');
        lightboxImage.src = shots[index].full;
        labels();
        try { await lightboxImage.decode(); } catch (_) { /* The descriptive alt remains available on a failed image. */ }
        if (token === lightboxRequest && dialog.open) lightboxImage.classList.remove('is-loading');
    }

    function open() {
        clearTimeout(timer);
        ++request;
        savedScroll = {left: window.scrollX, top: window.scrollY};
        bodyStyles = ['position', 'top', 'left', 'right', 'width'].map(key => [key, document.body.style[key]]);
        document.documentElement.classList.add('home-screenshot-open');
        Object.assign(document.body.style, {position: 'fixed', top: -savedScroll.top + 'px', left: -savedScroll.left + 'px', right: '0', width: '100%'});
        dialog.showModal();
        renderLightbox();
        closeButton.focus({preventScroll: true});
    }

    function closed() {
        ++lightboxRequest;
        lightboxImage.removeAttribute('src');
        document.documentElement.classList.remove('home-screenshot-open');
        if (bodyStyles) bodyStyles.forEach(([key, value]) => { document.body.style[key] = value; });
        if (savedScroll) window.scrollTo({...savedScroll, behavior: 'instant'});
        openButton.focus({preventScroll: true});
        manualUntil = Date.now() + 30000;
        schedule();
    }

    thumbs.forEach((button, i) => {
        button.disabled = false;
        button.addEventListener('click', () => select(i, true));
        button.addEventListener('keydown', event => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const target = event.key === 'Home' ? 0 : event.key === 'End' ? shots.length - 1 : (i + (event.key === 'ArrowRight' ? 1 : -1) + shots.length) % shots.length;
            thumbs[target].focus({preventScroll: true});
            select(target, true);
        });
    });
    openButton.disabled = false;
    openButton.addEventListener('click', open);
    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', closed);
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    previous.addEventListener('click', () => select(index - 1, true));
    next.addEventListener('click', () => select(index + 1, true));
    dialog.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        select(event.key === 'Home' ? 0 : event.key === 'End' ? shots.length - 1 : index + (event.key === 'ArrowRight' ? 1 : -1), true);
    });
    const stage = dialog.querySelector('.screenshot-dialog-stage');
    stage.addEventListener('pointerdown', event => {
        if (event.pointerType === 'touch' && !event.isPrimary) swipe = null;
        if (event.pointerType === 'touch' && event.isPrimary && !event.target.closest('button')) {
            swipe = {id: event.pointerId, x: event.clientX, y: event.clientY};
            stage.setPointerCapture(event.pointerId);
        }
    });
    stage.addEventListener('pointerup', event => {
        if (!swipe || swipe.id !== event.pointerId) return;
        const dx = event.clientX - swipe.x, dy = event.clientY - swipe.y;
        swipe = null;
        if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.5) select(index + (dx < 0 ? 1 : -1), true);
    });
    stage.addEventListener('pointercancel', () => { swipe = null; });
    root.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovering = true; schedule(); } });
    root.addEventListener('pointerleave', () => { hovering = false; schedule(); });
    root.addEventListener('focusin', schedule);
    root.addEventListener('focusout', () => setTimeout(schedule, 0));
    document.addEventListener('visibilitychange', schedule);
    document.addEventListener('zh:languagechange', labels);
    motion.addEventListener('change', () => { labels(); schedule(); });
    window.addEventListener('pagehide', () => { clearTimeout(timer); if (dialog.open) dialog.close(); });
    window.addEventListener('pageshow', schedule);
    labels();
    schedule();
})();
