function showCreate() {
  document.getElementById("createTab").classList.remove("hidden");
  document.getElementById("historyTab").classList.add("hidden");
  document.querySelectorAll(".tab")[0].classList.add("active");
  document.querySelectorAll(".tab")[1].classList.remove("active");
}

function showHistory() {
  document.getElementById("createTab").classList.add("hidden");
  document.getElementById("historyTab").classList.remove("hidden");
  document.querySelectorAll(".tab")[1].classList.add("active");
  document.querySelectorAll(".tab")[0].classList.remove("active");
}
