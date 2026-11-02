/* Sign-in inside the iOS home-screen app: Google sign-in leaves the app and iOS keeps that session in Safari,
   so the app may stay signed out. All buttons stay; a small note under the Google button explains this. */
(() => {
    'use strict';
    const google = document.getElementById('account-google');
    if (!google) return;
    const media = query => window.matchMedia?.(query).matches === true;
    const standalone = navigator.standalone === true || media('(display-mode: standalone)') || media('(display-mode: fullscreen)');
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (!standalone || !ios) return;
    const texts = {
        de: 'Hinweis: Am iPhone öffnet die Google-Anmeldung Safari. Für die App mit E-Mail und Passwort anmelden.',
        en: 'Note: On iPhone, Google sign-in opens Safari. For the app, sign in with email and password.'
    };
    const note = document.createElement('p');
    note.className = 'account-oauth-note account-app-note';
    note.setAttribute('role', 'note');
    note.setAttribute('data-i18n-ignore', '');
    const render = () => { note.textContent = texts[window.ZHLanguage?.language === 'en' ? 'en' : 'de']; };
    render();
    google.after(note);
    document.addEventListener('zh:languagechange', render);
})();
