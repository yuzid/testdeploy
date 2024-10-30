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

// Function to generate a short link (for demonstration)
function generateShortlink() {
  let url = document.getElementById("urlInput").value;
  alert("Shortlink generated for: " + url);
}

// Toggle sidebar
document.getElementById("toggle-btn").addEventListener("click", function () {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("expanded");
});

// Handle form submission
document
  .getElementById("short-url-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission
    generateQRCode();
  });

function generateQRCode() {
  const urlInputElement = document.getElementById("url-input");
  const titleInputElement = document.getElementById("title-input");
  const downloadButton = document.getElementById("download-btn");
  const copyButton = document.getElementById("copy-btn");

  const urlValue = urlInputElement.value;
  const titleValue = titleInputElement.value;

  if (urlValue && titleValue) {
    // Save URL and Title
    const qrData = urlValue; // URL for QR code

    // Replace input fields with spans
    const titleSpan = document.createElement("span");
    titleSpan.textContent = titleValue;
    titleInputElement.parentNode.replaceChild(titleSpan, titleInputElement);

    const urlSpan = document.createElement("span");
    urlSpan.textContent = urlValue;
    urlInputElement.parentNode.replaceChild(urlSpan, urlInputElement);

    // Hide the generate button and show the preview section
    document.getElementById("generate-btn").style.display = "none";
    document.getElementById("qr-preview").style.display = "block";

    // Generate short URL
    const shortUrl = generateShortUrl(urlValue);

    // Generate QR Code and display it on canvas
    const qrCanvas = document.getElementById("qr-canvas");
    const ctx = qrCanvas.getContext("2d");
    const img = new Image();

    // URL for QR code from API
    const qrCodeDataUrl = generateQRCodeFromUrl(qrData);
    console.log("Generated QR Code URL: ", qrCodeDataUrl); // Debug URL

    img.onload = function () {
      ctx.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
      ctx.drawImage(img, 0, 0, qrCanvas.width, qrCanvas.height);

      // Show download and copy buttons
      downloadButton.style.display = "block";
      copyButton.style.display = "block";

      // Function to download the QR Code
      downloadButton.onclick = function () {
        const link = document.createElement("a");
        link.href = qrCodeDataUrl;
        link.download = "qrcode.png";
        link.click();
      };

      // Function to copy QR Code to clipboard
      copyButton.onclick = function () {
        copyImageToClipboard(qrCodeDataUrl); // Implement this function if not done
      };

      // Display the short URL with the prefix "plb.sh/"
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

function generateShortUrl(userUrl) {
  // Ensure the generated short URL has the prefix 'http://localhost:8000/' and includes the user-provided URL
  return "http://localhost:8000/" + encodeURIComponent(userUrl);
}

function generateQRCodeFromUrl(url) {
  // Generate the QR code URL using the provided URL
  return (
    "https://api.qrserver.com/v1/create-qr-code/?data=" +
    encodeURIComponent(url) +
    "&size=300x300"
  );
}
