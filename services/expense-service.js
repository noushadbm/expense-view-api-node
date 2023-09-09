const db = require('../db/queries');
const util = require('../utils/util');
const err = require('../common/constants');

const syncInit = (request, response) => {
    //let userNameHeader = request.headers['user-name'];
    let userIdHeader = request.headers['user-id'];
    const userId = parseInt(userIdHeader);
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
    // 1. Check if user id in url matches token userid
    let userIdHeader = request.headers['user-id'];
    let userIdInParam = request.params.userId;
    if (userIdHeader != userIdInParam) {
        console.log('User id in token and request are not same. ', userIdHeader, ' != ', userIdInParam);
        util.authFailureResponse(err.ERR_016, response);
        return;
    }
    // 2. Check if meta id present for the user id
    const metadataId = parseInt(request.params.id);
    db.getMetaMasterById(userIdInParam, metadataId).then((rows) => {
        if (rows.length == 0) {
            console.log('Error while syncUpdate: Meta master record not found for the sync update request.');
            util.failureResponse(err.ERR_009, response);
        } else {
            // 3. Add record
            const { entries } = request.body;
            db.insertExpenses(entries, metadataId)
                .then(result => {
                    console.log('No. of rows updated: ', result.rowCount);
                    util.successResponse({ rowsUpdated: result.rowCount }, response);
                }).catch(error => {
                    console.log(`Error while syncUpdate`, error);
                    util.failureResponse(err.ERR_009, response);
                });
        }
    });
}

const syncFinish = (request, response) => {
    // 1. Check if user id in url matches token userid
    let userIdHeader = request.headers['user-id'];
    let userIdInParam = request.params.userId;
    if (userIdHeader != userIdInParam) {
        console.log('User id in token and request are not same. ', userIdHeader, ' != ', userIdInParam);
        util.authFailureResponse(err.ERR_016, response);
        return;
    }

    // 2. Check if meta id present for the user id
    const metadataId = parseInt(request.params.id);
    db.getMetaMasterById(userIdInParam, metadataId).then((rows) => {
        if (rows.length == 0) {
            console.log('Error while syncUpdate: Meta master record not found for the sync finish request.');
            util.failureResponse(err.ERR_009, response);
        } else {
            // 3. Update finish record.
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
    });
}

const restoreInit = (request, response) => {
    const userId = parseInt(request.params.userId);
    db.getMetadataIdForUser(userId)
        .then(metadataId => {
            return db.getTotalMetadataCount(userId, metadataId);
        }).then(details => {
            util.successResponse({ metadataId: details.metadataId, totalCount: details.count }, response);
        }).catch(error => {
            console.log('Error while restore initialization.', error);
            util.failureResponse(err.ERR_011, response);
        });
}

module.exports = {
    syncInit,
    syncUpdate,
    syncFinish,
    restoreInit,
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
