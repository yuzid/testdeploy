// gengen.js: Menggabungkan fungsi dari generate.js

// Fungsi kembali ke halaman sebelumnya
function goBack() {
  window.history.back();
}

// Placeholder untuk QR code generation di canvas
const qrCanvas = document.getElementById("qr-code-canvas");

const generateQRCodePlaceholder = () => {
  const context = qrCanvas.getContext("2d");
  context.fillStyle = "#000";
  context.fillRect(0, 0, 150, 150); // Placeholder black square
};

generateQRCodePlaceholder();

// Fungsi copy QR code ke clipboard
document.getElementById("copy-btn").addEventListener("click", () => {
  qrCanvas.toBlob((blob) => {
    const item = new ClipboardItem({ "image/png": blob });
    navigator.clipboard
      .write([item])
      .then(() => {
        alert("QR Code copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        alert("Failed to copy QR Code to clipboard.");
      });
  });
});

// Fungsi download QR code sebagai file gambar
document.getElementById("download-btn").addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = qrCanvas.toDataURL("image/png");
  link.download = "qr-code.png";
  link.click();
});

// Fungsi buka tab (dari generate.js)
function openTab(evt, tabName) {
  let i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Set default tab untuk dibuka pertama kali
// document.getElementById("defaultOpen").click();

// Fungsi untuk generate short link (untuk demonstrasi)
function generateShortlink() {
  const url = document.getElementById("urlInput").value;
  alert("Shortlink generated for: " + url);
}

// // Toggle sidebar
// document.getElementById("toggle-btn").addEventListener("click", function () {
//   const sidebar = document.getElementById("sidebar");
//   sidebar.classList.toggle("expanded");
// });

// Fungsi generate QR code dan tampilkan di canvas (dari generate.js)
function generateQRCodeWithUrl() {
  const urlInputElement = document.getElementById("url-input");
  const titleInputElement = document.getElementById("title-input");
  const downloadButton = document.getElementById("download-btn");
  const copyButton = document.getElementById("copy-btn");

  const urlValue = urlInputElement.value;
  const titleValue = titleInputElement.value;

  if (urlValue && titleValue) {
    const qrData = urlValue;

    // Menyembunyikan input dan menampilkan hasil
    titleInputElement.parentNode.replaceChild(
      createSpan(titleValue),
      titleInputElement
    );
    urlInputElement.parentNode.replaceChild(
      createSpan(urlValue),
      urlInputElement
    );

    document.getElementById("generate-btn").style.display = "none";
    document.getElementById("qr-preview").style.display = "block";

    const shortUrl = generateShortUrl(urlValue);
    const qrCodeDataUrl = generateQRCodeFromUrl(qrData);
    console.log("Generated QR Code URL: ", qrCodeDataUrl);

    const img = new Image();
    img.onload = function () {
      const ctx = qrCanvas.getContext("2d");
      ctx.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
      ctx.drawImage(img, 0, 0, qrCanvas.width, qrCanvas.height);

      downloadButton.style.display = "block";
      copyButton.style.display = "block";

      downloadButton.onclick = () => downloadQRCode(qrCodeDataUrl);
      copyButton.onclick = () => copyImageToClipboard(qrCodeDataUrl);

      addCartItem(shortUrl, urlValue);
    };

    img.onerror = function () {
      console.error("Failed to load image.");
      alert("Failed to load QR code. Please try again.");
    };

    img.src = qrCodeDataUrl;
  } else {
    alert("Please enter both a valid Title and URL");
  }
}

// Fungsi untuk membuat elemen span dari teks
function createSpan(text) {
  const span = document.createElement("span");
  span.textContent = text;
  return span;
}

// Fungsi untuk men-download QR Code
function downloadQRCode(qrCodeDataUrl) {
  const link = document.createElement("a");
  link.href = qrCodeDataUrl;
  link.download = "qrcode.png";
  link.click();
}

// Fungsi untuk menyalin gambar ke clipboard
function copyImageToClipboard(qrCodeDataUrl) {
  fetch(qrCodeDataUrl)
    .then((res) => res.blob())
    .then((blob) => {
      const item = new ClipboardItem({ "image/png": blob });
      return navigator.clipboard.write([item]);
    })
    .then(() => {
      alert("QR Code copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy image: ", err);
      alert("Failed to copy QR Code to clipboard.");
    });
}

// Fungsi untuk menambahkan item ke cart list
function addCartItem(shortUrl, urlValue) {
  const cartList = document.getElementById("cart-list");
  const cartItem = document.createElement("li");
  cartItem.classList.add("cart-item");
  cartItem.innerHTML = `
    <div>
      <p><strong>Short URL:</strong> <a href="${shortUrl}" target="_blank">${shortUrl}</a></p>
      <p><strong>Destination URL:</strong> <a href="${urlValue}" target="_blank">${urlValue}</a></p>
      <p><strong>Custom URL:</strong> <a href="${urlValue}" target="_blank">${urlValue}</a></p>
    </div>
  `;
  cartList.appendChild(cartItem);
}

// Fungsi untuk generate short URL
function generateShortUrl(userUrl) {
  return "http://localhost:8000/" + encodeURIComponent(userUrl);
}

// Fungsi untuk generate QR code dari URL
function generateQRCodeFromUrl(url) {
  return (
    "https://api.qrserver.com/v1/create-qr-code/?data=" +
    encodeURIComponent(url) +
    "&size=300x300"
  );
}
