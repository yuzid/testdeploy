import pool from '../../config/config.js';
import format from 'pg-format';

const Qr = {}

Qr.insert = async(id, image,date,email,color,url,title) => {
    return await pool.query(`INSERT INTO qr_codes(id_qr, qr_image, time_qr_created, email, color, url, title) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [id,image,date,email,color,url,title]);
} 
Qr.show = async(id) => {
    return await pool.query(`SELECT qr_image FROM qr_codes WHERE id_qr = $1`, [id]);
} 


export default Qr;