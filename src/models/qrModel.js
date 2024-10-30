import pool from '../../config/config.js';
import format from 'pg-format';

const Qr = {}

Qr.insert = async(id, image,date,email) => {
    return await pool.query(`INSERT INTO qr_codes VALUES ($1, $2, $3, $4)`, [id,image,date,email]);
} 
Qr.show = async(id) => {
    return await pool.query(`SELECT qr_image FROM qr_codes WHERE id_qr = $1`, [id]);
} 


export default Qr;