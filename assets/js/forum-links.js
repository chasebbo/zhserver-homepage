/* Larger targets reuse the actual thread anchor; nested controls keep their own action. */
(() => {
    'use strict';
    const controls = 'a,button,input,select,textarea,label,summary,[role="button"],[role="link"],[role="combobox"],[role="checkbox"],[role="menuitem"],[role="switch"],[contenteditable]:not([contenteditable="false"]),[tabindex]';
    function bind(row, link) {
        row.classList.add('forum-clickable-row'); row.tabIndex = 0; row.setAttribute('role', 'link');
        row.setAttribute('aria-label', window.ZHLanguage.t('forum.openThread', { title:link.textContent }));
        row.addEventListener('click', event => {
            const control = event.target.closest?.(controls);
            if (event.defaultPrevented || event.button !== 0 || (control && control !== row) || window.getSelection()?.toString()) return;
            link.click();
        });
        row.addEventListener('keydown', event => {
            if (event.target !== row || !['Enter', ' '].includes(event.key)) return;
            event.preventDefault(); if (!event.repeat) link.click();
        });
    }
    window.ZHForumLinks = Object.freeze({ bind });
})();
