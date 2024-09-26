import pool from '../../config/config.js';
import format from 'pg-format';

const account = {};

const requireAuthotp = (req, res, next) => {
    if (req.session.email) {
        return next();
    } else {
        return res.redirect('http://localhost:8000/send-otp');
    }
};


export default account;