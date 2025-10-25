// main DOM logic — depends on translations (loaded before this file)
(function () {
  // expose functions used by inline onclick attributes
  function closeOverlay() {
    const overlay = document.getElementById('overlay');
    if (overlay && overlay.classList.contains('show')) overlay.classList.remove('show');
  }
  function toggleLanguageMenu() {
    const overlay = document.getElementById('overlay');
    if (overlay && overlay.classList.contains('show')) return;
    const langMenu = document.getElementById('language-menu');
    if (langMenu) langMenu.classList.toggle('hidden');
  }

  function setLanguage(lang) {
    const data = translations[lang];
    if (!data) return;
    const flagIcon = document.getElementById('language-flag');
    const savedate = document.getElementById('savedate');
    const description = document.getElementById('description');
    const desktopNav = document.querySelector('.desktop-nav');
    const overlayMenu = document.querySelector('.overlay-menu');

    if (flagIcon) flagIcon.src = data.flag;
    if (savedate) savedate.innerHTML = `<p>${data.weddate}</p>`;
    if (description) {
      description.innerHTML = data.content.menu;
      description.className = `overlay-box ${data.class}`;
      description.dir = data.dir;
    }

    document.querySelectorAll('.menu-link').forEach(el => el.textContent = data.nav[0]);
    document.querySelectorAll('.travel-link').forEach(el => el.textContent = data.nav[1]);
    document.querySelectorAll('.hotel-link').forEach(el => el.textContent = data.nav[2]);
    document.querySelectorAll('.faq-link').forEach(el => el.textContent = data.nav[3]);

    if (desktopNav) desktopNav.dir = data.dir;
    if (overlayMenu) overlayMenu.dir = data.dir;

    localStorage.setItem('language', lang);
    const langMenu = document.getElementById('language-menu');
    if (langMenu) langMenu.classList.add('hidden');
  }

  function updateDescription(section) {
    const lang = localStorage.getItem('language') || 'it';
    const data = translations[lang];
    const description = document.getElementById('description');
    if (!data || !description) return;
    description.innerHTML = data.content[section];
    description.className = `overlay-box ${data.class}`;
    description.dir = data.dir;
  }

  function updateCountdown() {
    const eventDate = new Date('2026-05-16T17:00:00');
    const now = new Date();
    const diffTime = eventDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const countdownText = diffDays >= 0 ? `${diffDays} days to go!` : `+${Math.abs(diffDays)} days ago`;
    const el = document.getElementById('countdown-days');
    if (el) el.textContent = countdownText;
  }

  // expose to global for inline handlers
  window.closeOverlay = closeOverlay;
  window.toggleLanguageMenu = toggleLanguageMenu;
  window.setLanguage = setLanguage;

  document.addEventListener('DOMContentLoaded', () => {
    // initialize language
    const savedLang = localStorage.getItem('language') || navigator.language.slice(0, 2);
    const langCode = ['it', 'en', 'lb'].includes(savedLang) ? savedLang : 'it';
    setLanguage(langCode);

    // attach nav buttons
    document.querySelectorAll('.menu-link').forEach(el =>
      el.addEventListener('click', () => updateDescription('menu'))
    );
    document.querySelectorAll('.travel-link').forEach(el =>
      el.addEventListener('click', () => updateDescription('travel'))
    );
    document.querySelectorAll('.hotel-link').forEach(el =>
      el.addEventListener('click', () => updateDescription('hotel'))
    );
    document.querySelectorAll('.faq-link').forEach(el =>
      el.addEventListener('click', () => updateDescription('faq'))
    );

    // initial countdown
    updateCountdown();
    // optional: keep updated hourly
    setInterval(updateCountdown, 1000 * 60 * 60);
  });
})();