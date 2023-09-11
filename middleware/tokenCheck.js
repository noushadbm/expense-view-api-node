const util = require('../utils/util');
const passwordUtil = require('../utils/password-util');
const err = require('../common/constants');
const db = require('../db/queries');

const checkToken = (req, res, next) => {
    let bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        let token = bearerHeader.replace('Bearer ', '');
        passwordUtil.verifyJwt(token).then((parsedJwt) => {
            let username = parsedJwt.body.username;
            return db.getUserByName(username).then((users) => {
                if (users.length) {
                    return users[0];
                } else {
                    throw Error('User not found with name:', username);
                }
            });
        }).then((user) => {
            req.headers['user-name'] = user.username;
            req.headers['user-id'] = user.user_id;
            next();
        }).catch((error) => {
            console.log('Middleware error:', error)
            util.authFailureResponse(err.ERR_014, res);
        });
    } else {
        console.log('Middleware error: No bearer token.')
        util.authFailureResponse(err.ERR_015, res);
    }
}

module.exports = {
    checkToken,
}