/* Shared legal documents and registration contract. Existing Auth client only. */
(() => {
    'use strict';
    if (window.ZHLegal || !window.ZHLanguage) return;
    const language = window.ZHLanguage;
    const root = new URL('../../', document.currentScript.src);
    const version = '2026-10-08';
    // Reviewed consent migration applied and verified in the existing project on 2026-10-08.
    const backendEnabled = true;
    function documentUrl(document, pinned = false) {
        const url = new URL(document === 'rules' ? 'community-regeln/' : 'nutzungsbedingungen/', root);
        if (pinned) url.searchParams.set('version', version);
        return url.href;
    }
    async function verifyRegistration(client) {
        if (!backendEnabled) throw new Error('legal.registrationUnavailable');
        const result = await client.rpc('get_zh_registration_policy');
        if (result.error) throw new Error('legal.registrationUnavailable');
        if (result.data?.terms_version !== version || result.data?.community_rules_version !== version ||
            result.data?.acceptance_required !== true) throw new Error('legal.versionChanged');
    }
    function signupData() {
        return { zh_legal_consent: { accepted: true, terms_version: version, community_rules_version: version } };
    }
    window.ZHLegal = Object.freeze({ version, backendEnabled, documentUrl, verifyRegistration, signupData });

    const alias = document.querySelector('[data-legal-alias]');
    if (alias) {
        language.setLanguage('en');
        const target = new URL(documentUrl(alias.dataset.legalAlias));
        const requested = new URLSearchParams(location.search).get('version');
        if (requested) target.searchParams.set('version', requested);
        target.hash = location.hash;
        alias.href = target.href;
        location.replace(target.href);
        return;
    }
    const page = document.querySelector('[data-legal-document]');
    if (!page) return;
    const documentType = page.dataset.legalDocument;
    const requested = new URLSearchParams(location.search).get('version') || version;
    document.querySelectorAll('[data-legal-i18n]').forEach(node => language.bind(node, node.dataset.legalI18n));
    language.bind(document.getElementById('legal-related'), 'legal.footerNavigation', {}, 'aria-label');
    language.bind(document.querySelector('title'), documentType === 'rules' ? 'legal.rulesPageTitle' : 'legal.termsPageTitle');
    language.bind(document.getElementById('legal-heading'), documentType === 'rules' ? 'legal.rules' : 'legal.terms');
    language.bind(document.getElementById('legal-intro'), documentType === 'rules' ? 'legal.rulesIntro' : 'legal.termsIntro');
    const versionLabel = document.getElementById('legal-version');
    if (requested !== version) {
        versionLabel.hidden = true;
        page.querySelector('.legal-document').hidden = true;
        document.getElementById('legal-related').hidden = true;
        const notice = document.createElement('p');
        notice.className = 'legal-unavailable';
        language.bind(notice, 'legal.versionUnavailable');
        page.append(notice);
        const current = document.createElement('a');
        current.href = documentUrl(documentType);
        language.bind(current, 'legal.currentVersion');
        notice.append(document.createElement('br'), current);
        return;
    }
    language.bind(versionLabel, 'legal.version', { version });
})();
