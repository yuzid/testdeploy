let selectedColor = "#000000"; // Default color
let logoImage = null; // Store uploaded logo
let qrData = ""; // Store the current QR data (URL)

// Track selected color option
let selectedColorElement = null;

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

// Set default tab to open
document.getElementById("defaultOpen").click();

function generateQRCode() {
  const urlInputElement = document.getElementById("url-input");
  const titleInputElement = document.getElementById("title-input");
  const generateBtn = document.getElementById("generate-btn");
  const downloadButton = document.getElementById("download-btn");
  const copyButton = document.getElementById("copy-btn");

  const urlValue = urlInputElement.value;
  const titleValue = titleInputElement.value;

  if (urlValue && titleValue) {
    qrData = urlValue; // Simpan URL untuk digunakan nanti

    // Ganti input field dengan teks biasa (span)
    const titleSpan = document.createElement("span");
    titleSpan.textContent = titleValue;
    titleSpan.id = "title-span";
    titleInputElement.parentNode.replaceChild(titleSpan, titleInputElement);

    const urlSpan = document.createElement("span");
    urlSpan.textContent = urlValue;
    urlSpan.id = "url-span";
    urlInputElement.parentNode.replaceChild(urlSpan, urlInputElement);

    generateBtn.style.display = "none";
    document.getElementById("qr-style-section").style.display = "flex";
    document.getElementById("qr-preview").style.display = "block";

    // Gambar QR Code dan logo, lalu salin ke clipboard
    drawQRCode(urlValue)
      .then((mergedImageURL) => {
        console.log("Merged Image URL:", mergedImageURL); // Debugging line
        downloadButton.style.display = "block";
        copyButton.style.display = "block";

        // Fungsi untuk mengunduh QR Code
        downloadButton.onclick = () => {
          const link = document.createElement("a");
          link.href = mergedImageURL;
          link.download = "qrcode.png";
          link.click();
        };

        // Fungsi untuk menyalin QR Code ke clipboard
        copyButton.onclick = () => {
          copyImageToClipboard(mergedImageURL);
        };
      })
      .catch((err) => {
        console.error("Error generating QR code: ", err);
        alert("Gagal menghasilkan QR code. Silakan coba lagi.");
      });
  } else {
    alert("Please enter both a valid Title and URL");
  }
}

function copyImageToClipboard(mergedImageURL) {
  fetch(mergedImageURL)
    .then((res) => res.blob())
    .then((blob) => {
      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard
        .write([item])
        .then(() => alert("QR Code berhasil disalin ke clipboard"))
        .catch((err) => {
          console.error("Gagal menyalin gambar: ", err);
          alert("Gagal menyalin gambar ke clipboard. Silakan coba lagi.");
        });
    })
    .catch((err) => {
      console.error("Error fetching image: ", err);
      alert("Gagal mengunduh gambar. Silakan coba lagi.");
    });
}

function drawQRCode(data) {
  return new Promise((resolve, reject) => {
    const canvas = document.getElementById("qr-canvas");
    const ctx = canvas.getContext("2d");

    // Membuat gambar QR Code
    const qrImg = new Image();
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      data
    )}&color=${selectedColor.replace("#", "")}`;

    qrImg.onload = function () {
      // Clear the canvas sebelum menggambar
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gambar QR Code
      ctx.drawImage(qrImg, 0, 0, canvas.width, canvas.height);

      // Jika logo sudah diunggah, gambar logo di atas QR Code
      if (logoImage) {
        const logoSize = 50; // Ukuran logo
        const logoX = (canvas.width - logoSize) / 2; // Posisi X logo di tengah
        const logoY = (canvas.height - logoSize) / 2; // Posisi Y logo di tengah

        ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
      }

      // Convert canvas to image URL
      canvas.toBlob((blob) => {
        const mergedImageURL = URL.createObjectURL(blob);
        resolve(mergedImageURL);
      }, "image/png");
    };

    qrImg.onerror = function () {
      reject("Failed to load QR code image");
    };
  });
}

// Fungsi untuk mengunggah logo
function handleLogoUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      logoImage = new Image();
      logoImage.src = e.target.result;
      logoImage.onload = () => {
        // Gambar ulang QR Code setelah logo diunggah
        drawQRCode(qrData)
          .then((mergedImageURL) => {
            console.log("Merged Image URL:", mergedImageURL); // Debugging line
            // Update any necessary UI elements here if needed.
          })
          .catch((err) => {
            console.error("Error regenerating QR code with logo: ", err);
            alert("Gagal menghasilkan QR code dengan logo. Silakan coba lagi.");
          });
      };
    };
    reader.readAsDataURL(file);
  }
}

function changeColor(color, element) {
  selectedColor = color;

  // Highlight selected color option
  if (selectedColorElement) {
    selectedColorElement.style.border = "none";
  }
  element.style.border = "2px solid black";
  selectedColorElement = element;

  if (qrData) {
    drawQRCode(qrData); // Regenerate QR Code with new color
  }
}

document.getElementById("logo-img").addEventListener("click", () => {
  document.getElementById("logo-upload").click();
});

document
  .getElementById("logo-upload")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      logoImage = new Image();
      logoImage.src = e.target.result;
      logoImage.onload = function () {
        // Regenerate QR Code with the uploaded logo
        if (qrData) {
          drawQRCode(qrData);
        }
      };
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  });

// Initialize Feather Icons
feather.replace();
