const db = require('./queries')
const util = require('./util');

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

module.exports = {
    register,
    getAllUsers,
}