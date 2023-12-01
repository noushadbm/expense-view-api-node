const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
//const path = require("path");
//const nocache = require('nocache');
// To read environment variables from .env file.
dotenv.config();

// Middlewares
const middlewares = require("./middleware/tokenCheck");

// Services
const userService = require("./services/user-service");
const expenseService = require("./services/expense-service");
const authService = require("./services/auth-service");
const houseKeepingService = require("./services/house-keeping-service");

const app = express();
const port = process.env.PORT || 3000;

// Set static file folder.
//app.use(express.static("public"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Expires', '0');
  next();
});

app.get('/', (request, response) => {
  response.json({ info: 'Hello from expense-view API' });
});

// app.use("/", function (req, res) {
//   //const fileName = "index.html";

//   // Inser access log and then serve the index.html
//   houseKeepingService
//     .addUserAccessLog(req)
//     .then((result) => {
//       console.log("Return index.html");
//       //res.header('Last-Modified', (new Date()).toUTCString());
//       const headers = {'Expires': 0, 'Pragma': 'no-cache', 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Last-Modified': (new Date()).toUTCString()};
//       //res.sendFile(path.resolve('public/index.html'), { headers: hdrs, lastModified: false, etag: false });

//       res.sendFile(path.resolve('public/index.html'), { headers }, (err) => {
//         if (err) {
//           console.error(`Error sending file: ${err}`);
//           res.status(err.status || 500).end();
//         } else {
//           console.log('File sent successfully');
//         }
//       });
//     })
//     .catch((error) => {
//       console.log("Failed with error:", error);
//     });
// });

// TODO: Add intercepter to validate token en each API calls.

// User related APIs.
app.get("/api/v1/users", userService.getAllUsers);
app.get("/api/v1/users/:id", userService.getUserById);
app.post("/api/v1/users", userService.register);
app.put("/api/v1/users/:id", middlewares.checkToken, userService.updateUser);
app.delete("/api/v1/users/:id", middlewares.checkToken, userService.deleteUser);

// House keeping service
app.get("/api/v1/clearRecords", houseKeepingService.removeOldNonReadyRecords);

// Expense data related APIs.
app.get(
  "/api/v1/expenses/:userId/sync/begin",
  middlewares.checkToken,
  expenseService.syncInit
);
app.post(
  "/api/v1/expenses/:userId/sync/:id",
  middlewares.checkToken,
  expenseService.syncUpdate
);
app.post(
  "/api/v1/expenses/:userId/sync/:id/finish",
  middlewares.checkToken,
  expenseService.syncFinish
);
app.get(
  "/api/v1/expenses/:userId/restore/begin",
  middlewares.checkToken,
  expenseService.restoreInit
);

app.post("/api/v1/authenticate", authService.login);
app.post("/api/v1/logout", authService.logout);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
