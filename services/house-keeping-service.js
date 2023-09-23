const db = require("../db/queries");
const util = require("../utils/util");
const err = require("../common/constants");

const removeOldNonReadyRecords = (request, response) => {
  console.log("Clear records.");
  Promise.all([db.deleteNonReadyUserRecords(), db.deleteNonReadyMetadata()])
    .then((values) => {
      const result1 = values[0];
      const result2 = values[1];
      console.log(`Clear records result 1: ${result1}`);
      console.log(`Clear records result 2: ${result2}`);

      util.successResponse({ status: "DONE" }, response);
    })
    .catch((error) => {
      console.log("Error while deleting non ready user.", error);
      util.failureResponse(err.ERR_007, response);
    });
};

const addUserAccessLog = (req) => {
  console.log("Add access log...");
  var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  var userAgent = req.headers["user-agent"];
  console.log("ip: >>", ip);
  console.log("userAgent: >>", userAgent);
  return db.addUserAccessLog(ip, userAgent);
};

module.exports = {
  removeOldNonReadyRecords,
  addUserAccessLog,
};
