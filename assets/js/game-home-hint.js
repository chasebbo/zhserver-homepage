/* Game page on phones: small dismissible tip to add the game to the home screen (opens without browser bar). */
(() => {
    'use strict';
    const box = document.querySelector('[data-game-home-hint]');
    if (!box) return;
    const KEY = 'zh_game_home_hint_dismissed_v1';
    const texts = {
        ios: { de: 'Tipp: Über Teilen und dann „Zum Home-Bildschirm“ läuft das Spiel ohne Browserleiste. Die App hat einen eigenen Speicher, dort meldest du dich einmal neu an.',
            en: 'Tip: Use Share and then “Add to Home Screen” to play without the browser bar. The app keeps its own storage, so sign in there once.' },
        other: { de: 'Tipp: Über das Browser-Menü „Zum Startbildschirm hinzufügen“, dann läuft das Spiel ohne Browserleiste.',
            en: 'Tip: Use the browser menu “Add to Home screen” to play without the browser bar.' },
        close: { de: 'Hinweis schließen', en: 'Close tip' }
    };
    const media = query => window.matchMedia?.(query).matches === true;
    const standalone = media('(display-mode: standalone)') || media('(display-mode: fullscreen)') || navigator.standalone === true;
    const phone = media('(max-width: 900px)') || media('(pointer: coarse)');
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    let dismissed = false;
    try { dismissed = localStorage.getItem(KEY) === '1'; } catch (_) { /* Without storage the tip can still be closed for this visit. */ }
    if (standalone || !phone || dismissed) return;
    const language = () => window.ZHLanguage?.language === 'en' ? 'en' : 'de';
    const text = box.querySelector('[data-game-home-hint-text]'), close = box.querySelector('[data-game-home-hint-close]');
    function render() {
        text.textContent = texts[ios ? 'ios' : 'other'][language()];
        close.setAttribute('aria-label', texts.close[language()]);
    }
    close.addEventListener('click', () => {
        box.hidden = true;
        try { localStorage.setItem(KEY, '1'); } catch (_) { /* Closed for this visit only. */ }
    });
    document.addEventListener('zh:languagechange', render);
    render();
    box.hidden = false;
})();
