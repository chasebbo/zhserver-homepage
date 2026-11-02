/* Sign-in inside the iOS home-screen app: Google sign-in leaves the app and iOS keeps that session in a
   separate browser window, so the app would stay signed out. There the app asks for email and password. */
(() => {
    'use strict';
    const oauth = document.getElementById('account-oauth');
    const form = document.getElementById('zh-account-form');
    if (!oauth || !form) return;
    const media = query => window.matchMedia?.(query).matches === true;
    const standalone = navigator.standalone === true || media('(display-mode: standalone)') || media('(display-mode: fullscreen)');
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (!standalone || !ios) return;
    const texts = {
        de: 'In der App vom Home-Bildschirm bitte mit E-Mail und Passwort anmelden. Die Anmeldung mit Google öffnet ein eigenes Browserfenster, und iOS gibt sie nicht an die App weiter. Noch kein Passwort? Über „Passwort vergessen?“ legst du eins fest.',
        en: 'In the app from your home screen, please sign in with email and password. Google sign-in opens a separate browser window and iOS does not pass it on to the app. No password yet? Set one with “Forgot password?”.'
    };
    const style = document.createElement('style');
    style.textContent = '#account-oauth { display: none !important; } .account-app-note { margin: 0 0 18px; }';
    document.head.append(style);
    const note = document.createElement('p');
    note.className = 'account-oauth-note account-app-note';
    note.setAttribute('role', 'note');
    note.setAttribute('data-i18n-ignore', '');
    const render = () => { note.textContent = texts[window.ZHLanguage?.language === 'en' ? 'en' : 'de']; };
    render();
    form.before(note);
    document.addEventListener('zh:languagechange', render);
})();
