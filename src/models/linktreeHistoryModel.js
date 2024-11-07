import pool from '../../config/config.js';
const LtHistory = {};

LtHistory.insert = async (id_linktree, time, style, buttons, title, bio) => {
    return await pool.query(`INSERT INTO linktree_history VALUES ($1, $2, NULL, $3, $4, $5, $6)`, [id_linktree, time, style, buttons, title, bio])
}

LtHistory.insertDeleted = async (id_linktree, time, style, buttons, title, bio) => {
    return await pool.query(`INSERT INTO linktree_history VALUES ($1, $2, 'deleted', $3, $4, $5, $6)`, [id_linktree, time, style, buttons, title, bio])
}

export default LtHistory;