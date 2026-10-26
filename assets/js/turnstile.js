/* Optional Cloudflare Turnstile for Supabase Auth forms. Inactive while no public site key is set. */
(() => {
    'use strict';
    if (window.ZHTurnstile) return;
    // Public site key of the Cloudflare Turnstile widget. Empty: every form works without captcha.
    // Only enable Supabase captcha protection after a release that carries this key.
    const SITE_KEY = '';
    const API = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    const disabled = Object.freeze({ enabled: false, token: async () => undefined, reset() {} });
    let loading = null;
    function load() {
        if (window.turnstile) return Promise.resolve(window.turnstile);
        loading ||= new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = API; script.async = true;
            script.onload = () => window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile.failed'));
            script.onerror = () => { loading = null; reject(new Error('turnstile.failed')); };
            document.head.append(script);
        });
        return loading;
    }
    // One widget per form. Tokens are single-use: reset after every Auth request.
    function create(container, language = 'auto') {
        if (!SITE_KEY || !container) return disabled;
        container.hidden = false;
        let id = null, current = '', waiting = [];
        const ready = load().then(api => {
            id = api.render(container, {
                sitekey: SITE_KEY, theme: 'dark', size: 'flexible', appearance: 'interaction-only', language,
                callback: token => { current = token; const list = waiting; waiting = []; list.forEach(resolve => resolve(token)); },
                'expired-callback': () => { current = ''; },
                'error-callback': () => { current = ''; }
            });
        });
        return Object.freeze({
            enabled: true,
            async token() {
                await ready;
                if (current) return current;
                return new Promise((resolve, reject) => {
                    const timer = setTimeout(() => {
                        waiting = waiting.filter(entry => entry !== done);
                        reject(new Error('turnstile.failed'));
                    }, 30000);
                    const done = token => { clearTimeout(timer); resolve(token); };
                    waiting.push(done);
                });
            },
            reset() { current = ''; if (id !== null) window.turnstile?.reset(id); }
        });
    }
    window.ZHTurnstile = Object.freeze({ enabled: !!SITE_KEY, create });
})();
