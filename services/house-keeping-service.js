const db = require('../db/queries');
const util = require('../utils/util');
const err = require('../common/constants');

const removeOldNonReadyRecords = (request, response) => {
    console.log('Clear records.');
    Promise.all([db.deleteNonReadyUserRecords(), db.deleteNonReadyMetadata()])
        .then((values) => {
            const result1 = values[0];
            const result2 = values[1];
            console.log(`Clear records result 1: ${result1}`);
            console.log(`Clear records result 2: ${result2}`);

            util.successResponse({ status: 'DONE' }, response);

        }).catch(error => {
            console.log('Error while deleting non ready user.', error);
            util.failureResponse(err.ERR_007, response);
        });
}

module.exports = {
    removeOldNonReadyRecords
}