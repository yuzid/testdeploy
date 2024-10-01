import pool from '../../config/config.js';

const SlHistory = {};


SlHistory.insert = async (id_shortlink, short_url) => {
    return await pool.query(`INSERT INTO shortlink_history VALUES ($1, $2, now()::timestamp)`, [id_shortlink, short_url])
}

SlHistory.insertDeleted = async (id_shortlink, short_url) => {
    return await pool.query(`INSERT INTO shortlink_history VALUES ($1, $2, now()::timestamp, 'deleted')`, [id_shortlink, short_url])
}

export default SlHistory;