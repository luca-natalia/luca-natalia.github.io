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

const input = document.getElementById("fileInput");
const dropzone = document.getElementById("dropzone");
const preview = document.getElementById("preview");
const uploadBtn = document.getElementById("uploadBtn");
const status = document.getElementById("status");

let filesArray = [];

// CLICK
dropzone.addEventListener("click", () => input.click());

// INPUT FILE
input.addEventListener("change", (e) => {
  addFiles(e.target.files);
});

// DRAG ENTER
dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dragover");
});

// DRAG LEAVE
dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dragover");
});

// DROP
dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");
  addFiles(e.dataTransfer.files);
});

// ADD FILES
function addFiles(fileList) {
  filesArray = filesArray.concat(Array.from(fileList));
  renderPreview();
}

// PREVIEW
function renderPreview() {
  preview.innerHTML = "";

  filesArray.forEach((file, index) => {
    const div = document.createElement("div");
    div.className = "preview-item";

    let el;

    if (file.type.startsWith("image/")) {
      el = document.createElement("img");
      el.src = URL.createObjectURL(file);
    } else {
      el = document.createElement("video");
      el.src = URL.createObjectURL(file);
      el.controls = true;
    }

    div.appendChild(el);
    preview.appendChild(div);
  });
}

// UPLOAD
uploadBtn.addEventListener("click", async () => {
  if (!filesArray.length) {
    status.innerText = "Nessun file selezionato";
    return;
  }

  const formData = new FormData();

  filesArray.forEach(file => {
    formData.append("files", file);
  });

  status.innerText = `Upload di ${filesArray.length} file...`;

  try {
    const res = await fetch("https://project-favtv.vercel.app/api/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.success) {
      status.innerText = `Upload completato ✔ (${data.count} file)`;
      filesArray = [];
      renderPreview();
    } else {
      status.innerText = "Errore upload";
    }

  } catch (err) {
    status.innerText = "Errore connessione";
  }
});
