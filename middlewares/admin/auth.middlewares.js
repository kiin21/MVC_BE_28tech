const systemConfig = require('../../config/system');
const Account = require('../../models/account.model');
const Role = require('../../models/role.model');

module.exports.requireAuth = async (req, res, next) => {
    let token_ = req.cookies.token;
    if (!token_) {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
        const user = await Account.findOne({ token: token_ }).select("-password");

        if (!user) {
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        } else {
            const role = await Role.findOne({ _id: user.role_id }).select("title permission");
            res.locals.user = user;
            res.locals.role = role;
            next();
        }
    }

}