let translations = {};

function loadTranslations(callback) {
  fetch('translations.json')
    .then(response => response.json())
    .then(data => {
      translations = data;
      let savedLang = localStorage.getItem('language');
      if (!savedLang) {
        const browserLang = navigator.language.slice(0, 2);
        savedLang = ['it', 'en', 'lb'].includes(browserLang) ? browserLang : 'it';
      }
      setLanguage(savedLang);
      if (callback) callback();
    });
}

function setLanguage(lang) {
  const data = translations[lang];
  if (!data) return;

  document.getElementById('language-flag').src = data.flag;
  const savedate = document.getElementById('savedate');
  savedate.innerHTML = `<p>${data.weddate}</p><span id="countdown-days" class="savedate"></span>`;

  const description = document.getElementById('description');
  description.innerHTML = data.content.menu;
  description.className = `overlay-box ${data.class}`;
  description.dir = data.dir;

  document.querySelectorAll('.menu-link').forEach(el => el.textContent = data.nav[0]);
  document.querySelectorAll('.travel-link').forEach(el => el.textContent = data.nav[1]);
  document.querySelectorAll('.help-link').forEach(el => el.textContent = data.nav[2]);
  document.querySelectorAll('.about-link').forEach(el => el.textContent = data.nav[3]);

  document.querySelector('.desktop-nav').dir = data.dir;
  document.querySelector('.overlay-menu').dir = data.dir;

  localStorage.setItem('language', lang);
  document.getElementById('language-menu').classList.add('hidden');

  updateCountdown();
}

function updateDescription(section) {
  const lang = localStorage.getItem('language') || 'it';
  const data = translations[lang];
  const description = document.getElementById('description');
  description.innerHTML = data.content[section];
  description.className = `overlay-box ${data.class}`;
  description.dir = data.dir;
}

function toggleLanguageMenu() {
  document.getElementById('language-menu').classList.toggle('hidden');
}

function closeOverlay() {
  document.getElementById('overlay').classList.remove('show');
}

function updateCountdown() {
  const eventDate = new Date('2026-05-16T17:00:00');
  const now = new Date();
  const diffTime = eventDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const countdownText = diffDays >= 0 ? `${diffDays} days to go!` : `+${Math.abs(diffDays)} days ago`;
  const countdownSpan = document.getElementById('countdown-days');
  if (countdownSpan) countdownSpan.textContent = countdownText;
}

window.addEventListener('DOMContentLoaded', () => {
  loadTranslations(() => {
    document.querySelectorAll('.menu-link').forEach(el =>
      el.addEventListener('click', () => updateDescription('menu'))
    );
    document.querySelectorAll('.travel-link').forEach(el =>
      el.addEventListener('click', () => updateDescription('travel'))
    );
    document.querySelectorAll('.help-link').forEach(el =>
      el.addEventListener('click', () => updateDescription('help'))
    );
    document.querySelectorAll('.about-link').forEach(el =>
      el.addEventListener('click', () => updateDescription('about'))
    );
  });
});
