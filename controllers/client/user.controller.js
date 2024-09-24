const User = require("../../models/user.model");
const md5 = require('md5')
// [get] /user/register
module.exports.register = (req, res) => {
    res.render("client/pages/user/register");
};

// [post] /user/register
module.exports.registerPost = async (req, res) => {
    const existedEmail = await User.findOne({ email: req.body.email });
    if (existedEmail) {
        req.flash('error', 'Email already exists');
        res.redirect('/user/register');
    } else {
        req.body.password = md5(req.body.password);
        const user = new User(req.body);
        await user.save();

        res.cookie('userToken', user.userToken)
        res.redirect('/');
    }
}