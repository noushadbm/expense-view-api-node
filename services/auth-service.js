const db = require('../db/queries');
const util = require('../utils/util');
const passwordUtil = require('../utils/password-util');
const err = require('../common/constants');

const login = (request, response) => {
    const { username, password } = request.body;
    console.log('Login request received for user:', username);
    db.getUserByName(username).then((users) => {
        if (users.length) {
            return users[0];
        } else {
            throw Error('User not found with name:', username);
        }
    }).then((user) => {
        let hashedPwd = user.user_password;
        let isCorrectPass = passwordUtil.isCorrectPassword(password, hashedPwd);
        const res = {};
        if (isCorrectPass) {
            res.correctPass = true;
            res.userId = user.user_id;
        } else {
            res.correctPass = false;
        }
        return res;
    }).then((result) => {
        if (result.correctPass) {
            let expiry = passwordUtil.getTokenExpiry();
            let token = passwordUtil.generateJwt({ username }, expiry);
            db.updateAuthByName(username, token, expiry).then(() => {
                util.successResponse({ status: 'success', token, userName: username, userId: result.userId, expiry }, response);
            }).catch((error) => {
                throw error;
            });
        } else {
            console.log('Username or password does not match.');
            util.authFailureResponse(err.ERR_013, response);
        }
    }).catch(error => {
        console.log(`Error while authenticating user: ${username}.`, error);
        util.authFailureResponse(err.ERR_012, response);
    });
}

const logout = (request, response) => {
    console.log('Logout request received.');
    let bearerHeader = request.headers['authorization'];
    if (bearerHeader) {
        let token = bearerHeader.replace('Bearer ', '');
        passwordUtil.verifyJwt(token).then((parsedJwt) => {
            let username = parsedJwt.body.username;
            return db.resetAuthByName(username);
        }).then(() => {
            util.successResponse({ status: 'success' }, response);
        }).catch((error) => {
            console.log('Error:', error)
            util.authFailureResponse(err.ERR_014, response);
        });
    } else {
        console.log('Error');
        util.authFailureResponse(err.ERR_015, response);
    }
}

module.exports = {
    login,
    logout,
}