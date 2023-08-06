const db = require('../db/queries');
const util = require('../utils/util');
const err = require('../common/constants');

const syncInit = (request, response) => {
    const userId = parseInt(request.params.userId);
    db.getUserById(userId).then((users) => {
        if (users.length) {
            return users[0].user_id;
        } else {
            throw Error('User not found.');
        }
    }).then((result) => {
        // TODO: Check if user state is VERIFIED, else thorw error.
        console.log('Found user:', result);
        return db.createMetaData(userId);
    }).then(metadataId => {
        util.successResponse({ metadataId: metadataId }, response);
    }).catch(error => {
        console.log(`Error while initializing sync for user: ${userId}.`, error);
        util.failureResponse(err.ERR_004, response);
    });
}

const syncUpdate = (request, response) => { }

const syncFinish = (request, response) => { }

module.exports = {
    syncInit,
    syncUpdate,
    syncFinish,
}