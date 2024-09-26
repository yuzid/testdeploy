export const requireAuthotp = (req, res, next) => {
    if (req.session.email) {
        return next();
    } else {
        return res.redirect('http://localhost:8000/send-otp');
    }
};