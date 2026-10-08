/* Shared footer presentation. Visitor and community data remain independent. */
(() => {
    'use strict';
    if (window.ZHGlobalFooter) return;
    const scriptUrl = document.currentScript?.src;
    let mounting;

    function renderLabels() {
        let language = window.ZHLanguage?.language;
        if (!language) {
            try { language = localStorage.getItem('zh_language') === 'en' ? 'en' : 'de'; }
            catch (_) { language = 'de'; }
        }
        document.querySelectorAll('.zh-global-footer [data-footer-copy]').forEach(element => {
            const catalog = window.ZHTranslations;
            const value = (catalog?.copy[element.dataset.footerCopy] || catalog?.messages[element.dataset.footerCopy])?.[language];
            if (value && element.textContent !== value) element.textContent = value;
        });
        const navigation = document.querySelector('.zh-global-footer .zh-footer-links');
        const label = window.ZHTranslations?.messages['legal.footerNavigation']?.[language];
        if (navigation && label) navigation.setAttribute('aria-label', label);
    }

    function communitySection() {
        const section = document.createElement('section');
        section.className = 'zh-community zh-footer-community';
        section.setAttribute('data-community-stats', '');
        section.setAttribute('data-i18n-ignore', '');
        section.setAttribute('aria-labelledby', 'zh-footer-community-title');
        section.innerHTML = `<div class="zh-footer-community-heading">
                <h4 class="zh-community-group-title" id="zh-footer-community-title" data-community-text="accounts">Community</h4>
                <small class="zh-footer-account-reset" data-community-text="accountReset">ACCOUNT-RESET: 15.07.2026</small>
            </div>
            <dl>
                <div class="zh-community-line zh-community-total"><dt data-community-text="totalOnline">Insgesamt online</dt><dd data-community-value="online_total">—</dd></div>
                <div class="zh-community-line"><dt data-community-text="membersOnline">Mitglieder</dt><dd data-community-value="online_members">—</dd></div>
                <div class="zh-community-line"><dt data-community-text="guestsOnline">Gäste</dt><dd data-community-value="online_guests">—</dd></div>
                <div class="zh-community-line"><dt data-community-text="registered">Registrierte Mitglieder</dt><dd data-community-value="registered_members">—</dd></div>
                <div class="zh-community-line zh-community-name"><dt data-community-text="newest">Neuestes Mitglied</dt><dd data-community-value="newest_member">—</dd></div>
            </dl>
            <p class="zh-community-status" data-community-status>Community-Zahlen sind noch nicht verfügbar.</p>`;
        return section;
    }

    function loadStyles() {
        if (!scriptUrl) return Promise.resolve();
        return Promise.all(['global-footer', 'community-stats'].map(name => {
            if (document.querySelector(`link[href*="${name}.css"]`)) return Promise.resolve();
            return new Promise(resolve => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = new URL(`../css/${name}.css?v=20261007-footer`, scriptUrl).href;
                link.onload = resolve;
                link.onerror = resolve;
                document.head.append(link);
            });
        }));
    }

    async function mountFooter() {
        const footer = document.querySelector('.site-footer');
        const container = footer?.querySelector('.container.footer');
        if (!container || footer.hasAttribute('data-global-footer-layout')) return;
        const visitors = footer.querySelector('.visitor-stats') || footer.querySelector('.footer-visitor');
        const blocks = [...container.children];
        const brand = blocks.find(block => block.querySelector('h3'));
        const legal = blocks.find(block => block.querySelector('a[href*="impressum"]'));
        const links = legal ? [...legal.querySelectorAll('a')] : [];
        for (const [route, key, label] of [
            ['nutzungsbedingungen/', 'legal.terms', 'Nutzungsbedingungen'],
            ['community-regeln/', 'legal.rules', 'Community-Regeln']
        ]) {
            if (!scriptUrl || links.some(link => link.href.includes(route))) continue;
            const link = document.createElement('a');
            link.href = new URL('../../' + route, scriptUrl).href;
            link.textContent = label;
            link.dataset.footerCopy = key;
            link.setAttribute('data-i18n-ignore', '');
            links.push(link);
        }
        const copyright = legal?.textContent.match(/©[\s\S]*/)?.[0].replace(/\s+/g, ' ').trim();
        if (!visitors || !brand || !legal || !copyright) return;
        await loadStyles();

        // Move existing nodes: retain live visitor values, i18n bindings and links.
        brand.classList.add('zh-footer-brand');
        const since = brand.querySelector('p:not(.footer-visitor)');
        if (since) {
            since.setAttribute('data-footer-copy', 'seit-2013');
            since.setAttribute('data-i18n-ignore', '');
        }
        const stats = document.createElement('div');
        stats.className = 'zh-footer-stats';
        const visitorGroup = document.createElement('div');
        visitorGroup.className = 'zh-footer-visitors';
        visitorGroup.append(visitors);
        stats.append(communitySection(), visitorGroup);

        const navigation = document.createElement('nav');
        navigation.className = 'zh-footer-links';
        links.forEach(link => {
            if (/impressum|datenschutz/.test(link.getAttribute('href'))) {
                link.dataset.footerCopy = link.getAttribute('href').includes('impressum') ? 'impressum' : 'datenschutz';
                link.setAttribute('data-i18n-ignore', '');
            }
            navigation.append(link);
        });
        const credit = document.createElement('small');
        credit.className = 'zh-footer-copyright';
        credit.textContent = copyright;
        legal.classList.add('zh-footer-legal');
        legal.replaceChildren(navigation, credit);
        container.replaceChildren(brand, stats, legal);
        footer.classList.add('zh-global-footer');
        footer.setAttribute('data-global-footer-layout', 'community-visitors');
        renderLabels();
        document.addEventListener('zh:languagechange', renderLabels);
        window.addEventListener('storage', event => { if (event.key === 'zh_language') renderLabels(); });
    }
    function mount() {
        return mounting ||= mountFooter();
    }
    window.ZHGlobalFooter = Object.freeze({ mount });
})();
