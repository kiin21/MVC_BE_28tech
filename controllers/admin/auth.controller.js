const Account = require('../../models/account.model');
const systemConfig = require('../../config/system');

const md5 = require('md5')

// [get] /admin/auth/login
module.exports.login = (req, res) => {

    if (req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
    else {
        res.render('admin/pages/auth/login', {
            pageTitle: 'Login'
        });
    }
};
// [post] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    let [email, password] = [req.body.email, req.body.password];
    let account = await Account.findOne({ email: email, deleted: false });

    if (!account) {
        req.flash('error', 'Email is not existed');
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
    else {
        if (md5(password) !== account.password) {
            req.flash('error', 'Password is incorrect');
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);

        } else {
            if (account.status === 'unavailable') {
                req.flash('error', 'Account is inactive');
                res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
            }
            else {
                res.cookie("token", account.token);
                res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
            }
        }
    }
};

// [get] /admin/auth/logout
module.exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};