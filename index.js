const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
// To read environment variables from .env file.
dotenv.config();

// Services
const userService = require('./services/user-service');
const expenseService = require('./services/expense-service');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get('/', (request, response) => {
    response.json({ info: 'Hello from expense-view API' });
});

// TODO: Add intercepter to validate token en each API calls.

// User related APIs.
app.get('/api/v1/users', userService.getAllUsers);
app.get('/api/v1/users/:id', userService.getUserById);
app.post('/api/v1/users', userService.register);
app.put('/api/v1/users/:id', userService.updateUser);
app.delete('/api/v1/users/:id', userService.deleteUser);
app.get('/api/v1/clearRecords', userService.removeOldNonReadyRecords);

// Expense data related APIs.
app.get('/api/v1/expenses/:userId/sync/begin', expenseService.syncInit);
app.post('/api/v1/expenses/:userId/sync/:id', expenseService.syncUpdate);
app.post('/api/v1/expenses/:userId/sync/:id/finish', expenseService.syncFinish);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});