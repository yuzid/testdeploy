import account from '../models/accountModel.js';
import nodemailer from 'nodemailer';
import cryptoRandomString from 'crypto-random-string';
import argon2 from 'argon2';
import dotenv from 'dotenv';
import session from 'express-session';

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
    const verificationLink = `http://localhost:8000/verify-email?token=${verificationToken}&email=${email}`;
    const mailOptions = {
        from: {
            name: "Authenticator",
            address: process.env.USER
        },
        to: email,
        subject: 'Kode OTP & Verifikasi Akun Pobaners',
        text: `Kode OTP mu adalah ${otp}, akan kadaluwarsa dalam 5 menit.\n\n
        Atau klik link ini untuk verifikasi: ${verificationLink}`
    };

    return transporter.sendMail(mailOptions);
};

const kirim_otp = async (req,res) => {
    try {
        const {email, password} = req.body;
        const hashedPassword = await argon2.hash(password, 11);
        const otp = cryptoRandomString({ length: 6, type: 'numeric' });
        const verificationToken = cryptoRandomString({ length: 32, type: 'url-safe' });

        // Store OTP, token, and hashed password
        otpStorage[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000, hashedPassword };
        verificationTokenStorage[email] = { token: verificationToken, hashedPassword, expiresAt: Date.now() + 5 * 60 * 1000 };

        await sendVerificationEmail(email, otp, verificationToken);
        res.status(200).send('otp dikirim');

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error sending OTP: ' + error.message });
    }
};



const verifikasi =  async(req,res) => {
    try {
        const { otp } = req.body;
        const email = req.session.email;
        if (otpStorage[email]) {
            const { otp: storedOtp, expiresAt, hashedPassword } = otpStorage[email];

            // Secure OTP comparison
            const isOtpValid = crypto.timingSafeEqual(Buffer.from(otp), Buffer.from(storedOtp));

            if (isOtpValid && Date.now() < expiresAt) {
                await pool.query(`INSERT INTO account (email, password) VALUES ($1, $2)`, [email, hashedPassword]);
                delete otpStorage[email];
                delete verificationTokenStorage[email];
                return res.status(200).send({ msg: 'Akun berhasil diaktivasi menggunakan OTP' });
            } else if (Date.now() >= expiresAt) {
                return res.status(400).send({ msg: 'OTP kadaluwarsa' });
            } else {
                return res.status(400).send({ msg: 'OTP salah' });
            }
        } else {
            return res.status(400).send({ msg: 'OTP belum dibuat untuk email ini' });
        }
    } catch (err) {
        res.status(500).send('Terjadi kesalahan server: ' + err.message);
    }
}


export default{
    sendVerificationEmail,
    kirim_otp
}