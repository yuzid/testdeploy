const email = "hafidz.zaenul.tif23@polban.ac.id"; // Set the email address here or dynamically set it
const limit = 10;
let page = 1;

const tableBody = document.getElementById("shortlinks-table-body");
const userEmail = document.getElementById("user-email");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

userEmail.textContent = email;

async function fetchShortlinks() {
    const url = `http://localhost:3000/shortlinks/${email}?limit=${limit}&page=${page}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        renderTable(data);
        updateButtons(data.length);
    } catch (error) {
        console.error("Error fetching data", error);
    }
}

function renderTable(data) {
tableBody.innerHTML = ""; // Bersihkan tabel sebelum render ulang
  
data.forEach((shortlink) => {
    const row = document.createElement("tr");
  
    const shortUrlCell = document.createElement("td");
    shortUrlCell.textContent = shortlink.short_url;
  
    const longUrlCell = document.createElement("td");
    longUrlCell.textContent = shortlink.long_url;
  
    const timeCell = document.createElement("td");
    timeCell.textContent = new Date(shortlink.time_shortlink_created).toLocaleString(); // Format waktu
  
    row.appendChild(shortUrlCell);
    row.appendChild(longUrlCell);
    row.appendChild(timeCell);
  
    tableBody.appendChild(row);
    });
}

function updateButtons(dataLength) {
  prevBtn.disabled = page === 1;
  nextBtn.disabled = dataLength < limit;
}

prevBtn.addEventListener("click", () => {
  if (page > 1) {
    page--;
    fetchShortlinks();
  }
});

nextBtn.addEventListener("click", () => {
  page++;
  fetchShortlinks();
});

// Fetch data initially when page loads
fetchShortlinks();