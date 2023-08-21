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

const authFailureResponse = (errMessage, response) => {
    let respBody = {};
    respBody.statusCode = 401;
    respBody.statusMsg = 'FAILURE';
    respBody.error = errMessage;

    console.log(`Returning failure response: ${JSON.stringify(respBody)}`);
    response.status(401).send(respBody);
}

const getRandomNumber = () => {
    let min = 100;
    let max = 2147483647;
    return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
    successResponse,
    failureResponse,
    authFailureResponse,
    getRandomNumber,
}