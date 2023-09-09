const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
// To read environment variables from .env file.
dotenv.config();

// Middlewares
const middlewares = require('./middleware/tokenCheck');

// Services
const userService = require('./services/user-service');
const expenseService = require('./services/expense-service');
const authService = require('./services/auth-service');
const houseKeepingService = require('./services/house-keeping-service');

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
app.put('/api/v1/users/:id', middlewares.checkToken, userService.updateUser);
app.delete('/api/v1/users/:id', middlewares.checkToken, userService.deleteUser);

// House keeping service
app.get('/api/v1/clearRecords', houseKeepingService.removeOldNonReadyRecords);

// Expense data related APIs.
app.get('/api/v1/expenses/:userId/sync/begin', middlewares.checkToken, expenseService.syncInit);
app.post('/api/v1/expenses/:userId/sync/:id', middlewares.checkToken, expenseService.syncUpdate);
app.post('/api/v1/expenses/:userId/sync/:id/finish', middlewares.checkToken, expenseService.syncFinish);
app.get('/api/v1/expenses/:userId/restore/begin', middlewares.checkToken, expenseService.restoreInit);

app.post('/api/v1/authenticate', authService.login);
app.post('/api/v1/logout', authService.logout);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});