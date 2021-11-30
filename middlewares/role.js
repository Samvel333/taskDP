const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
let { UserService } = require('../user/service');

module.exports.roleID = async (req, res, next) => {
    let user = await UserService.getActiveUser(req.body.email);
    if (user.role_id != "1") {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({ message: "Only admin have access to this action" })
    }
    return next();
}