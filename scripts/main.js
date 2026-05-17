document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("fileInput");
  const dropzone = document.getElementById("dropzone");
  const uploadBtn = document.getElementById("uploadBtn");
  const status = document.getElementById("status");

  // 🔴 Safety check: evita crash silenziosi
  if (!input || !dropzone || !uploadBtn || !status) {
    console.error("Missing required DOM elements");
    return;
  }

  let files = [];

  // =========================
  // OPEN FILE PICKER
  // =========================
  function openPicker() {
    input.click();
  }

  dropzone.addEventListener("click", openPicker);
  uploadBtn.addEventListener("click", openPicker);

  // =========================
  // FILE SELECTION
  // =========================
  input.addEventListener("change", (e) => {
    files = Array.from(e.target.files || []);

    if (files.length === 0) {
      status.textContent = "Nessun file selezionato";
      return;
    }

    status.textContent = `${files.length} file selezionati`;
    console.log("Files:", files);
  });

  // =========================
  // UPLOAD (placeholder)
  // =========================
  uploadBtn.addEventListener("dblclick", async () => {

    if (!files.length) {
      status.textContent = "Seleziona prima i file";
      return;
    }

    status.textContent = "Upload in corso...";

    try {

      const formData = new FormData();

      files.forEach(file => {
        formData.append("files", file);
      });

      // 🔴 SOSTITUISCI CON LA TUA API
      const res = await fetch("https://project-favtv.vercel.app/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        status.textContent = `Upload completato (${data.count})`;
        files = [];
        input.value = "";
      } else {
        status.textContent = "Errore upload";
      }

    } catch (err) {
      console.error(err);
      status.textContent = "Errore connessione";
    }
  });

});
