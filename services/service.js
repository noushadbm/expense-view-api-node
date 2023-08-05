const db = require('../db/queries');
const util = require('../utils/util');
const err = require('../common/constants');

const register = (request, response) => {
    const { name, password, email } = request.body;
    db.createUser(name, password, email).then(userId => {
        //response.status(201).send(`User added with ID: ${userId}`)
        console.log('User created with id:', userId);
        util.successResponse({ id: userId }, response);
    }).catch(error => {
        console.log('Error while creating user. ', error);
        util.failureResponse(err.ERR_001, response);
    });
}

const getAllUsers = (request, response) => {
    db.getUsers()
        .then((allUsers) => {
            //response.status(200).json(allUsers);
            util.successResponse({ users: allUsers }, response);
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

const removeOldNonReadyRecords = (request, response) => {
    console.log('Clear records.');
    db.deleteNonReadyRecords().then((result) => {
        util.successResponse({ status: result }, response);
    }).catch((error) => {
        console.log('Error while deleting non ready user.', error);
        util.failureResponse(err.ERR_007, response);
    });
}

module.exports = {
    register,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    removeOldNonReadyRecords,
}