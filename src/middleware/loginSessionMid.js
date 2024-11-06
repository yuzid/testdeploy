export const loginSession = (req, res, next) => {
    if (req.session.userId) {
        return next();
    } else {
        return res.redirect('/account/login');
    }
};