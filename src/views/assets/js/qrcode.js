let currentQRData = null;

// Function to switch between tabs
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
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

// Handle form submission
document
  .getElementById("qrForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    try {
      const response = await fetch("/qr/generateQR", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        currentQRData = data;
        displayQRResult(data);
        document.getElementById("inputSection").style.display = "none";
        document.getElementById("resultSection").style.display = "block";
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  });

let currentQRStyle = {
  color: "#000000",
  logo: null,
};

function displayQRResult(data) {
  document.getElementById("qrTitle").textContent = "Title: " + data.title;
  document.getElementById("qrUrl").textContent = "URL: " + data.url;

  const img = document.createElement("img");
  img.src = data.imageData;
  img.alt = data.title;

  const container = document.getElementById("qrCodeContainer");
  container.innerHTML = "";
  container.appendChild(img);
}

async function updateQRStyle(color = null, element = null, logoInput = null) {
  const formData = new FormData();
  formData.append("url", currentQRData.url);
  formData.append("title", currentQRData.title);

  if (color) {
    currentQRStyle.color = color;
    document
      .querySelectorAll(".color-option")
      .forEach((opt) => opt.classList.remove("selected"));
    if (element) element.classList.add("selected");
  }
  formData.append("color", currentQRStyle.color);

  if (logoInput && logoInput.files[0]) {
    currentQRStyle.logo = logoInput.files[0];
  }
  if (currentQRStyle.logo) {
    formData.append("logo", currentQRStyle.logo);
  }

  try {
    const response = await fetch("/qr/generateQR", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      currentQRData = data;
      displayQRResult(data);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to update QR code style.");
  }
}

function copyQRCode() {
  if (currentQRData) {
    fetch(currentQRData.imageData)
      .then((res) => res.blob())
      .then((blob) => {
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard
          .write([item])
          .then(() => alert("QR Code copied to clipboard!"))
          .catch(() => alert("Failed to copy QR Code"));
      });
  }
}

function downloadQRCode() {
  if (currentQRData) {
    const a = document.createElement("a");
    a.href = currentQRData.imageData;
    a.download = `qr-code-${currentQRData.title}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

async function saveQRCode() {
  if (currentQRData) {
    const imageData = currentQRData.imageData; // Make sure currentQRData is defined somewhere
    const date = new Date().toISOString();
    
    try {
      const response = await fetch('/qr/saveqr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageData, date })
      });

      if (response.ok) {
        alert("QR berhasil disimpan ke database");
        // Reset form and UI only after successful save
        document.getElementById("qrForm").reset();
        document.getElementById("inputSection").style.display = "block";
        document.getElementById("resultSection").style.display = "none";
      } else {
        alert("Gagal menyimpan QR code");
      }
    } catch (error) {
      console.error('Error saving QR code:', error);
      alert("Terjadi kesalahan saat menyimpan QR code");
    }
  }
}

// History Functions
function editHistoryQR(button) {
  const historyItem = button.closest(".history-item");
  const title = historyItem.querySelector(".title").textContent;
  const url = historyItem.querySelector(".url").textContent;

  // Switch to Create tab
  document.getElementById("defaultOpen").click();

  // Fill form with history item data
  document.getElementById("url").value = url;
  document.getElementById("title").value = title;

  // Submit form to regenerate QR
  document.getElementById("qrForm").dispatchEvent(new Event("submit"));
}

function copyHistoryQR(button) {
  const historyItem = button.closest(".history-item");
  // Implementation depends on how you store the QR image data
  alert("QR Code copied to clipboard!");
}

function deleteHistoryQR(button) {
  const historyItem = button.closest(".history-item");
  if (confirm("Are you sure you want to delete this QR code?")) {
    historyItem.remove();
    // Also remove from storage
  }
}

async function displayQRCode1() {
  try {
    const response = await fetch('/qr/pick', {  // Adjust the endpoint as needed
      method: 'GET'
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('QR code retrieved successfully');
      
      // Assuming the image is stored as base64
      const qrImage = document.createElement('img');
      qrImage.src = data.imageData;  // If it's base64, it should already include the data:image/... prefix
      
      // Display the image in a container
      const container = document.getElementById('qrDisplayContainer');
      container.innerHTML = '';  // Clear previous content
      container.appendChild(qrImage);
    } else {
      console.error('Failed to retrieve QR code:', data.error);
    }
  } catch (error) {
    console.error('Error fetching QR code:', error);
  }
}

// Initialize
document.getElementById("defaultOpen").click();
