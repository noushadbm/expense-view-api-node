const db = require('../db/queries');
const util = require('../utils/util');

const register = (request, response) => {
    const { name, password, email } = request.body;
    db.createUser(name, password, email).then(userId => {
        //response.status(201).send(`User added with ID: ${userId}`)
        console.log('User created with id:', userId);
        util.successResponse({ id: userId }, response);
    }).catch(error => {
        console.log('Error while creating user. ', error);
        util.failureResponse(error, response);
    });
}

const getAllUsers = (request, response) => {
    db.getUsers()
        .then((allUsers) => {
            //response.status(200).json(allUsers);
            util.successResponse({ users: allUsers }, response);
        }).catch(error => {
            console.log('Error while getting all users', error);
            util.failureResponse(error, response);
        });
}

const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
    db.getUserById(id).then((users) => {
        util.successResponse({ user: users.length ? users[0] : null }, response);
    }).catch(error => {
        console.log(`Error while getting user by id: ${id}.`, error);
        util.failureResponse(error, response);
    });
}

const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, email } = request.body

    db.updateUser(id, name, email).then((userId) => {
        util.successResponse({ id: userId }, response);
    }).catch((error) => {
        console.log(`Error while updating user: ${id}.`, error);
        util.failureResponse(error, response);
    });
}

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)
    db.deleteUser(id).then((userId)=> {
        util.successResponse({ id: userId }, response);
    }).catch((error) => {
        console.log(`Error while deleting user: ${id}.`, error);
        util.failureResponse(error, response);
    });
}

module.exports = {
    register,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
}