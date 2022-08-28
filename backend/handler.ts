import express from "express";
import serverless from "serverless-http";
import { betaRegisteredUsersController } from "./src/controller/BetaRegisteredUsersController";
import { resortController } from "./src/controller/ResortController";
import { skiSessionController } from "./src/controller/SkiSessionController";
import { userController } from "./src/controller/UserController";
import cors from 'cors'
import { authController } from "./src/controller/AuthController";

const app = express();

app.use(cors())
app.use(express.json());

app.get("/user/:userId", async function (req, res) {
  userController.get(req, res)
});

app.put("/user", async function (req, res) {
  userController.update(req, res)
});

// app.get("/resort", async function (req, res) {
//   resortController.search(req, res)
// });
app.post('/resort/coords', async function (req, res) {
  resortController.getAllNearCoordinates(req, res)
})
app.get("/resort/:resortId", async function (req, res) {
  resortController.getById(req, res)
});

app.post('/ski-session', async function (req, res) {
  skiSessionController.add(req, res)
});

app.post('/beta-registered-user', async function (req, res) {
  betaRegisteredUsersController.add(req, res)
});

app.post('/auth/login', async function (req, res) {
  authController.login(req, res)
});
app.post('/auth/register', async function (req, res) {
  authController.register(req, res)
});
app.post('/auth/refresh-auth', async function (req, res) {
  authController.refreshAuth(req, res)
});

app.get('/bonjour', async function (req, res) {
  res.json({ message: `salut ${process.env.TEST_VAR}` })
})

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
