import account from '../models/accountModel.js';
import nodemailer from 'nodemailer';
import cryptoRandomString from 'crypto-random-string';
import argon2 from 'argon2';
import dotenv from 'dotenv';
import crypto from 'crypto';
import path from 'path';
import { __dirname } from '../../path.js';

dotenv.config();

let otpStorage = {};
let verificationTokenStorage = {};


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER,
        pass: process.env.APP_PASS
    }
});

const sendVerificationEmail = (email, otp, verificationToken) => {
    const verificationLink = `http://localhost:8000/account/vmail?token=${verificationToken}&email=${email}`;
    const mailOptions = {
        from: {
            name: "Authenticator",
            address: process.env.USER
        },
        to: email,
        subject: 'Kode OTP & Verifikasi Akun Polbaners',
        text: `Kode OTP mu adalah ${otp}, akan kadaluwarsa dalam 5 menit.\n\n
        Atau klik link ini untuk verifikasi: ${verificationLink}`
    };

    return transporter.sendMail(mailOptions);
};

const kirim_otp = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Hash the password
      const hashedPassword = await argon2.hash(password);
      const otp = cryptoRandomString({ length: 6, type: 'numeric' });
      const verificationToken = cryptoRandomString({ length: 32, type: 'url-safe' });
  
      // Store OTP and verification token with expiry time
      otpStorage[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000, hashedPassword };
      verificationTokenStorage[email] = { token: verificationToken, hashedPassword, expiresAt: Date.now() + 5 * 60 * 1000 };
  
      // Send verification email
      await sendVerificationEmail(email, otp, verificationToken);
  
      // Set session data
      req.session.email = email;
  
      // Redirect to verification page after successfully sending OTP
      res.redirect('/account/verifikasi');  // <-- Redirection here
  
    } catch (error) {
      // Handle errors
      res.status(500).json({ success: false, message: 'Error sending OTP: ' + error.message });
    }
  };
  

const verifikasi = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!otpStorage[email]) {
            return res.status(400).send({ msg: 'OTP belum dibuat untuk email ini' });
        }

        const { otp: storedOtp, expiresAt, hashedPassword } = otpStorage[email];

        // Check if OTP length matches before using timingSafeEqual to avoid errors
        if (otp.length !== storedOtp.length) {
            return res.status(400).send({ msg: 'OTP salah' });
        }

        // Secure OTP comparison
        const isOtpValid = crypto.timingSafeEqual(Buffer.from(otp), Buffer.from(storedOtp));

        // Validate OTP and check expiry time
        if (isOtpValid && Date.now() < expiresAt) {
            // Insert user into the database (account insertion here)
            await account.insert(email, hashedPassword, "inactive");

            // Cleanup after successful verification
            delete otpStorage[email];
            delete verificationTokenStorage[email];

            return res.status(200).send({ msg: 'Akun berhasil diaktivasi menggunakan OTP' });
        } else if (Date.now() >= expiresAt) {
            return res.status(400).send({ msg: 'OTP kadaluwarsa' });
        } else {
            return res.status(400).send({ msg: 'OTP salah' });
        }

    } catch (err) {
        res.status(500).send('Terjadi kesalahan server: ' + err.message);
    }
};

const verif_viamail = async(req,res) =>{
    const { token, email } = req.query;

    try {
        if (verificationTokenStorage[email]) {
            const { token: storedToken, expiresAt, hashedPassword } = verificationTokenStorage[email];

            if (token === storedToken && Date.now() < expiresAt) {
                await account.insert(email, hashedPassword, "inactive");
                delete otpStorage[email];
                delete verificationTokenStorage[email];
                return res.status(200).send({ msg: 'Akun berhasil diaktivasi menggunakan link verifikasi' });
            } else if (Date.now() >= expiresAt) {
                return res.status(400).send({ msg: 'Link verifikasi kadaluwarsa' });
            } else {
                return res.status(400).send({ msg: 'Token verifikasi salah' });
            }
        } else {
            return res.status(400).send({ msg: 'Token verifikasi belum dibuat untuk email ini' });
        }
    } catch (err) {
        res.status(500).send('Terjadi kesalahan server: ' + err.message);
    }
}

const login = async(req,res) =>{
    const { email, password } = req.body;

    try {
        const result = await account.emails(email);

        if (result.rows.length > 0) {
            const hashedPassword = result.rows[0].password;
            const isPasswordCorrect = await argon2.verify(hashedPassword,password);

            if (isPasswordCorrect) {
                req.session.userId = email;
                res.status(201).send({ msg: 'Behrasil Masuk' });
            } else {
                return res.status(401).send({ msg: 'Password salah!' });
            }
        } else {
            return res.status(404).send({ msg: 'Pengguna tidak ditemukan' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ msg: 'Terjadi kesalahan server' });
    }
}

const loginfe = async (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'aktivasi.html'));
};

const veriffe = async (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'verifikasi.html'));
};

export default{
    sendVerificationEmail,
    kirim_otp,
    verifikasi,
    verif_viamail,
    login,
    loginfe,
    veriffe
}