const express = require('express');
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

app.get('/users', service.getAllUsers);
app.get('/users/:id', service.getUserById);
app.post('/users', service.register);
app.put('/users/:id', service.updateUser);
app.delete('/users/:id', service.deleteUser);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});