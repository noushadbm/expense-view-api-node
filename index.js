const express = require('express');
const dotenv = require('dotenv');
// To read environment variables from .env file.
dotenv.config();

const service = require('./services/service');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' });
});

app.get('/api/v1/users', service.getAllUsers);
app.get('/api/v1/users/:id', service.getUserById);
app.post('/api/v1/users', service.register);
app.put('/api/v1/users/:id', service.updateUser);
app.delete('/api/v1/users/:id', service.deleteUser);
app.get('/api/v1/clearRecords', service.removeOldNonReadyRecords);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});