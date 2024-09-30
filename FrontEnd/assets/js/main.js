// Sidebar toggle functionality
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebar = document.querySelector(".sidebar");

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("expanded");

  // Change icon direction on toggle
  if (sidebar.classList.contains("expanded")) {
    sidebarToggle.innerHTML = '<i data-feather="chevron-left"></i>';
  } else {
    sidebarToggle.innerHTML = '<i data-feather="chevron-right"></i>';
  }

  // Refresh feather icons to update the icon after toggle
  feather.replace();
});

// Dropdown functionality for user profile
const userIcon = document.getElementById("user-icon");
const dropdown = document.getElementById("dropdown");

userIcon.addEventListener("click", () => {
  dropdown.classList.toggle("active");
});

// Refresh feather icons to update chevron down
feather.replace();
