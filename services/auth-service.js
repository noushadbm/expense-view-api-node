const db = require('../db/queries');
const util = require('../utils/util');
const passwordUtil = require('../utils/password-util');
const err = require('../common/constants');

const login = (request, response) => {
    const { username, password } = request.body;
    db.getUserByName(username).then((users) => {
        if (users.length) {
            return users[0];
        } else {
            throw Error('User not found with name:', username);
        }
    }).then((user) => {
        let hashedPwd = user.user_password;
        return passwordUtil.isCorrectPassword(password, hashedPwd);
    }).then((isCorrectPwd) => {
        if (isCorrectPwd) {
            util.successResponse({ status: 'success', token: passwordUtil.generateJwt({username}) }, response);
        } else {
            console.log('Username or password does not match.');
            util.authFailureResponse(err.ERR_013, response);
        }

    }).catch(error => {
        console.log(`Error while authenticating user: ${username}.`, error);
        util.authFailureResponse(err.ERR_012, response);
    });
}

module.exports = {
    login,
}