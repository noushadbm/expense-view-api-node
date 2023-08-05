const successResponse = (data, response) => {
    let respBody = {};
    respBody.statusCode = 0;
    respBody.statusMsg = 'SUCCESS';
    respBody.data = data;

    console.log(`Returning success response: ${JSON.stringify(respBody)}`);
    response.status(200).send(respBody);
}

const failureResponse = (errMessage, response) => {
    let respBody = {};
    respBody.statusCode = 100;
    respBody.statusMsg = 'FAILURE';
    respBody.error = errMessage;

    console.log(`Returning failure response: ${JSON.stringify(respBody)}`);
    response.status(200).send(respBody);
}

module.exports = {
    successResponse,
    failureResponse,
}