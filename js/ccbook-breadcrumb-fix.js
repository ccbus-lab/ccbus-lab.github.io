/**
 * CCBook Breadcrumb Fix
 * Fixes the CHAPTERS breadcrumb link to point to the correct index page
 */

(function() {
  'use strict';

  function fixChaptersBreadcrumb() {
    // Find the breadcrumb link that points to /ccbook/chapters/
    const breadcrumbLinks = document.querySelectorAll('.breadcrumb a[href*="/ccbook/chapters/"]');

    breadcrumbLinks.forEach(function(link) {
      const href = link.getAttribute('href');

      // If it's just /ccbook/chapters/ (without a chapter number), fix it
      if (href === '/ccbook/chapters/' || href === '/ccbook/chapters') {
        // Detect current language from path
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/en/')) {
          link.setAttribute('href', '/en/ccbook/');
        } else {
          link.setAttribute('href', '/ccbook/');
        }
      } else if (href === '/en/ccbook/chapters/' || href === '/en/ccbook/chapters') {
        link.setAttribute('href', '/en/ccbook/');
      }
    });
  }

  // Run on page load
  document.addEventListener('DOMContentLoaded', fixChaptersBreadcrumb);

  // Also run immediately in case DOM is already loaded
  if (document.readyState !== 'loading') {
    fixChaptersBreadcrumb();
  }
})();
