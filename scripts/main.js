let filesArray = [];

const input = document.getElementById("fileInput");
const dropzone = document.getElementById("dropzone");
const uploadBtn = document.getElementById("uploadBtn");
const status = document.getElementById("status");
const progressBar = document.getElementById("progressBar");

if (input && dropzone && uploadBtn && status) {

  dropzone.addEventListener("click", () => input.click());

  input.addEventListener("change", (e) => {
    filesArray = Array.from(e.target.files || []);
    status.innerText = `${filesArray.length} file selezionati`;
  });

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function processInParallel(items, limit, fn) {
    const results = [];
    let index = 0;

    async function worker() {
      while (index < items.length) {
        const current = index++;
        results[current] = await fn(items[current]);
      }
    }

    const workers = Array(Math.min(limit, items.length))
      .fill(null)
      .map(worker);

    await Promise.all(workers);
    return results;
  }

  uploadBtn.addEventListener("click", async () => {

    if (!filesArray.length) {
      status.innerText = "Nessun file selezionato";
      return;
    }

    status.innerText = "Preparazione upload...";
    if (progressBar) progressBar.style.width = "5%";

    try {

      const payload = await processInParallel(filesArray, 3, async (file) => {
        const data = await fileToBase64(file);
        return {
          name: file.name,
          type: file.type,
          data
        };
      });

      status.innerText = "Upload in corso...";
      if (progressBar) progressBar.style.width = "20%";

      const res = await fetch("https://project-favtv.vercel.app/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ files: payload })
      });

      if (progressBar) progressBar.style.width = "80%";

      const data = await res.json();

      if (data.success) {
        status.innerText = `Upload completato ✔ (${data.count} file)`;
        filesArray = [];

        if (progressBar) {
          progressBar.style.width = "100%";
          setTimeout(() => progressBar.style.width = "0%", 800);
        }

      } else {
        status.innerText = "Errore upload";
      }

    } catch (err) {
      console.error(err);
      status.innerText = "Errore connessione";
    }

  });
}
