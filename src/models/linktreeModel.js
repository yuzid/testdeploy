import pool from '../../config/config.js';
import format from 'pg-format';

const Linktree = {};

Linktree.getAll = async () => {
    return await pool.query(`SELECT * FROM shortlinks`);
}

Linktree.getBy = async (field, value) => {
    const sql = format(`SELECT * FROM linktrees WHERE %I = $1`, field);
    return await pool.query(sql, [value]);
}

Linktree.insert = async (id, title, url, email, style) => {
    return await pool.query(`INSERT INTO linktrees VALUES ($1, $2, $3, now()::timestamp, $4, $5)` ,[id,title,url,email,style]);
}

Linktree.update = async (field, value, fieldCriteria, valueCriteria) => {
    const sql = format(`UPDATE linktrees SET %I = $1 WHERE %I = $2`, field, fieldCriteria);
    return await pool.query(sql, [value, valueCriteria]);
}

Linktree.delete = async (field, value) => {
    const sql = format(`DELETE FROM linktrees WHERE %I = $1`, field);
    return await pool.query(sql, [value]);
}

Linktree.exists = async (field, value) => {
    const sql = format(`SELECT EXISTS(SELECT 1 FROM linktrees WHERE %I = $1)`, field);
    return await pool.query(sql, [value]);
}

export default Linktree