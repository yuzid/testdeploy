import qr from 'qrcode';
import sharp from 'sharp';
import path from 'path';
import { __dirname } from '../../path.js';
import Qr from '../models/qrModel.js';

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

    let logoDataURI = null;

    // If logo is provided, overlay it on the QR code
    if (logo) {
      const logoBuffer = await sharp(logo.buffer)
        .resize(50, 50)
        .toBuffer();
      
      finalImage = finalImage.composite([
        { input: logoBuffer, gravity: 'center' }
      ]);

      // Convert logoBuffer to Base64 Data URI
      const base64Logo = logoBuffer.toString('base64');
      logoDataURI = `data:image/png;base64,${base64Logo}`; // Create Data URI for logo
    }

    const outputBuffer = await finalImage.png().toBuffer();

    // Convert buffer to base64
    const base64Image = outputBuffer.toString('base64');
    const dataURI = `data:image/png;base64,${base64Image}`;

    res.json({
      success: true,
      imageData: dataURI,
      title: title,
      url: url,
      logo: logoDataURI // Include logo Data URI in the response
    });

  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
};

const qrmain = async(req,res) =>{
    res.sendFile(path.join(__dirname, 'src', 'views', 'qrcode.html'));
}

const saveQR = async (req, res) => {
  try {
    const id_qr = '123a'; 
    const email = 'yazid.fauzan.tif23@polban.ac.id'; 
    const { imageData, date, color, url, title} = req.body;

    // Check if imageData is a base64 string, if so, remove prefix and convert to Buffer
    let imageBuffer;
    if (typeof imageData === 'string') {
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      imageBuffer = Buffer.from(base64Data, 'base64');
    } else {
      imageBuffer = imageData;
    }

    // Save binary imageBuffer
    await Qr.insert(id_qr, imageBuffer, date, email, color,url,title);
    res.status(200).json({ message: 'QR code saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save QR code' });
  }
};



const pickQR = async (req, res) => {
  try {
    const id  = '123a'; // Use dynamic ID from request params
    const result = await Qr.show(id);

    if (result.rows.length === 0) {
      console.log('QR code not found');
      return res.status(404).json({ 
        success: false, 
        error: 'QR code not found' 
      });
    }

    const qrImage = result.rows[0].qr_image;

    // Ensure qrImage is converted to base64 for web display
    const base64Image = Buffer.from(qrImage).toString('base64');
    const imageData = `data:image/png;base64,${base64Image}`;

    console.log('QR code retrieved successfully');
    res.status(200).json({
      success: true,
      imageData: imageData
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve QR code' 
    });
  }
};

export default{
    generateQRCode,
    qrmain,
    saveQR,
    pickQR
};
