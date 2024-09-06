document.getElementById('generateBtn').addEventListener('click', () => {
    const urlInput = document.querySelector('input[type="text"]').value;
    if (urlInput) {
        alert(`Generating QR Code for: ${urlInput}`);
        // Add your QR code generation logic here
    } else {
        alert('Please enter a URL');
    }
});
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

prevBtn.addEventListener('click', () => {
    //  Arahkan ke screen sebelumnya (misalnya: "shortlink.html")
    window.location.href = "shortlink.html";
});

nextBtn.addEventListener('click', () => {
    //  Arahkan ke screen berikutnya (misalnya: "qrcode.html")
    window.location.href = "help.html";
});