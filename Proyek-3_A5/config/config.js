import pg from 'pg';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const pool = new pg.Pool({ 
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
})

// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//         user: process.env.USER,
//         pass: process.env.APP_PASS
//     }
// });

export default pool;