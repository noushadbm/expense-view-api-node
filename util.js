const successResponse = (data, response) => {
    let respBody = {};
    respBody.statusCode = 0;
    respBody.statusMsg = 'SUCCESS';
    respBody.data = data;

    console.log(`Returning success response: ${JSON.stringify(respBody)}`);
    response.status(200).send(respBody);
}

const failureResponse = (message, response) => {
    let respBody = {};
    respBody.statusCode = 100;
    respBody.statusMsg = 'FAILURE';
    respBody.failureMessage = message;

    console.log(`Returning failure response: ${respBody}`);
    response.status(500).send(respBody);
}

module.exports = {
    successResponse,
    failureResponse,
}