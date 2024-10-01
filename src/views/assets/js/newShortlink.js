document.getElementById("generate-btn").addEventListener("click", function () {
  const url = document.getElementById("url-input").value;
  if (url) {
    document.getElementById("destination-url").innerText = url;
    document.getElementById("short-url").innerText = "plb.sh/he12gdnr"; // Simulasi short URL
    document.getElementById("preview-section").classList.remove("hidden");
  } else {
    alert("Please enter a valid URL");
  }
});

document.getElementById("qr-toggle").addEventListener("change", function () {
  const qrPreview = document.getElementById("qr-preview");
  if (this.checked) {
    qrPreview.innerHTML =
      '<img src="https://via.placeholder.com/100" alt="QR Code">';
  } else {
    qrPreview.innerHTML = "";
  }
});
