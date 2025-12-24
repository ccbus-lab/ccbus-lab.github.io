/**
 * Menu Language Switcher
 * Shows/hides the appropriate menu based on current page language
 * Also handles clicks on language switcher buttons in the header
 */

(function() {
  'use strict';

  function detectLanguage() {
    // Get current path
    const path = window.location.pathname;

    // Check if we're on an English page (path starts with /en/)
    if (path.startsWith('/en/')) {
      return 'en';
    }

    return 'zh-CN';
  }

  function switchMenuLanguage(lang) {
    const cnMenu = document.querySelector('.menu-lang-zh-CN');
    const enMenu = document.querySelector('.menu-lang-en');

    if (!cnMenu || !enMenu) {
      return;
    }

    if (lang === 'en') {
      cnMenu.style.display = 'none';
      enMenu.style.display = '';
    } else {
      cnMenu.style.display = '';
      enMenu.style.display = 'none';
    }
  }

  function attachLanguageSwitcherListeners() {
    // Language switcher buttons should navigate normally
    // The sidebar menu will be automatically shown in the correct language on page load
    // This function is kept for future enhancements if needed
    console.log('Language switcher initialized - buttons will navigate to translated pages');
  }

  function init() {
    const lang = detectLanguage();
    switchMenuLanguage(lang);
    attachLanguageSwitcherListeners();
  }

  // Run on page load
  document.addEventListener('DOMContentLoaded', init);

  // Also run immediately in case DOM is already loaded
  if (document.readyState !== 'loading') {
    init();
  }
})();
