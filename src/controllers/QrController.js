import qr from 'qrcode';
import sharp from 'sharp';
import path from 'path';
import { __dirname } from '../../path.js';

const generateQRCode = async (req, res) => {
  try {
    const { url, title, color } = req.body;
    const logo = req.file;

    if (!url || !title) {
      return res.status(400).json({ error: 'Please provide both URL and title' });
    }

    // Generate QR code
    const qrCodeBuffer = await qr.toBuffer(url, {
      color: {
        dark: color || '#000000',
        light: '#ffffff'
      }
    });

    let finalImage = sharp(qrCodeBuffer).resize(300, 300);

    // If logo is provided, overlay it on the QR code
    if (logo) {
      const logoBuffer = await sharp(logo.buffer)
        .resize(50, 50)
        .toBuffer();

      finalImage = finalImage.composite([
        { input: logoBuffer, gravity: 'center' }
      ]);
    }

    const outputBuffer = await finalImage.png().toBuffer();

    // Convert buffer to base64
    const base64Image = outputBuffer.toString('base64');
    const dataURI = `data:image/png;base64,${base64Image}`;

    res.json({
      success: true,
      imageData: dataURI,
      title: title,
      url: url
    });

  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
};

const qrmain = async(req,res) =>{
    res.sendFile(path.join(__dirname, 'src', 'views', 'qrcode.html'));
}

export default{
    generateQRCode,
    qrmain
};
