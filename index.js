const express = require('express');
const QRCode = require('qrcode');
const app = express();
const PORT = 3000;

var opts = {
  errorCorrectionLevel: 'H',
  type: 'image/jpeg',
  quality: 0.3,
  margin: 1,
  color: {
    dark:"#FF7F0000",
    light:"#FFBF60FF"
  }
}

app.get('/generateQR', async (req, res) => {
  try {
    const url = req.query.url || 'aiuerde';
    const qrCodeImage = await QRCode.toDataURL(url,opts);
    res.send(`<img src="${qrCodeImage}" alt="QR Code"/>`);
    // res.send(200, {
    //   id: qrCodeImage
    // }) 
  } 
  catch (err) {
    console.error('Error generating QR code:', err);
    res.status(500).send('Internal Server Error');
  }

});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});