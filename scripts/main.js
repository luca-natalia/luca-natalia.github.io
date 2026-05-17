document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("fileInput");
  const dropzone = document.getElementById("dropzone");
  const uploadBtn = document.getElementById("uploadBtn");
  const status = document.getElementById("status");

  if (!input || !dropzone || !uploadBtn || !status) {
    console.error("UPLOAD UI MISSING", {
      input, dropzone, uploadBtn, status
    });
    return;
  }

  console.log("UPLOAD MODULE INIT OK");

  uploadBtn.addEventListener("click", () => {
    console.log("CLICK OK");
  });

});
