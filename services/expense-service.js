const db = require('../db/queries');
const util = require('../utils/util');
const err = require('../common/constants');

const syncInit = (request, response) => {
    const userId = parseInt(request.params.userId);
    db.getUserById(userId)
        .then(ifUserExists())
        .then((result) => {
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

const syncUpdate = (request, response) => {
    // 1. Check if meta id present for the user id
    // 2. Add record
    const { entries } = request.body;
    const metadataId = parseInt(request.params.id);
    db.insertExpenses(entries, metadataId)
        .then(result => {
            console.log('No. of rows updated: ', result.rowCount);
            util.successResponse({ rowsUpdated: result.rowCount }, response);
        }).catch(error => {
            console.log(`Error while syncUpdate`, error);
            util.failureResponse(err.ERR_009, response);
        });
}

const syncFinish = (request, response) => {
    const metadataId = parseInt(request.params.id);
    const userId = parseInt(request.params.userId);
    db.updateMetaData(userId, metadataId, 'FINISHED')
        .then(rowCount => {
            // TODO: Return error if number of rows is zero.
            util.successResponse({ rowsUpdated: rowCount }, response);
        })
        .catch(error => {
            console.log('Error while sync finish,', error);
            util.failureResponse(err.ERR_010, response);
        });
}

module.exports = {
    syncInit,
    syncUpdate,
    syncFinish,
}

const ifUserExists = () => {
    return (users) => {
        if (users.length) {
            return users[0].user_id;
        } else {
            throw Error('User not found.');
        }
    };
}
