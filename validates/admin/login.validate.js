module.exports.login = (req, res, next) => {
    if (!req.body.email) {
        req.flash('error', 'Email is required');
        res.redirect('back');
    }

    if (!req.body.password) {
        req.flash('error', 'Password is required');
        res.redirect('back');
    }

    next();
}