const db = require('../db/queries');
const util = require('../utils/util');
const passwordUtil = require('../utils/password-util');
const err = require('../common/constants');

const register = (request, response) => {
    const { name, password, email } = request.body;
    let passwordHash = passwordUtil.encrypt(password);
    db.createUser(name, passwordHash, email).then(userId => {
        console.log('User created with id:', userId);
        let verificationCode = util.getRandomNumber();
        db.createAuthRecord(userId, verificationCode).then((status) => {
            util.successResponse({ user_id: userId, verificationCode }, response);
        }).catch((error) => {
            console.log(`Error while getting auth record for user id: ${userId},`, error);
            util.failureResponse(err.ERR_008, response);
        });

    }).catch(error => {
        console.log('Error while creating user. ', error);
        util.failureResponse(err.ERR_001, response);
    });
}

const getAllUsers = (request, response) => {
    db.getUsers()
        .then((allUsers) => {
            //response.status(200).json(allUsers);
            let filteredList = allUsers.map(user => {
                return {
                    user_id: user.user_id,
                    user_name: user.user_name,
                    email: user.email,
                    status: user.status,
                }
            });
            util.successResponse({ users: filteredList }, response);
        }).catch(error => {
            console.log('Error while getting all users', error);
            util.failureResponse(err.ERR_003, response);
        });
}

const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
    db.getUserById(id).then((users) => {
        if (users.length) {
            util.successResponse({ user: users[0] }, response);
        } else {
            util.failureResponse(err.ERR_002, response);
        }
    }).catch(error => {
        console.log(`Error while getting user by id: ${id}.`, error);
        util.failureResponse(err.ERR_004, response);
    });
}

const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, email } = request.body

    db.updateUser(id, name, email).then((userId) => {
        util.successResponse({ id: userId }, response);
    }).catch((error) => {
        console.log(`Error while updating user: ${id}.`, error);
        util.failureResponse(err.ERR_005, response);
    });
}

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)
    db.deleteUser(id).then((userId) => {
        util.successResponse({ id: userId }, response);
    }).catch((error) => {
        console.log(`Error while deleting user: ${id}.`, error);
        util.failureResponse(err.ERR_006, response);
    });
}

module.exports = {
    register,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
}