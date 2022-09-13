import express, { Request } from "express";
import serverless from "serverless-http";
import { betaRegisteredUsersController } from "./src/controller/BetaRegisteredUsersController";
import { resortController } from "./src/controller/ResortController";
import { skiSessionController } from "./src/controller/SkiSessionController";
import { userController } from "./src/controller/UserController";
import cors from 'cors'
import { authController } from "./src/controller/AuthController";
import { conversationController } from "./src/controller/ConversationController";
import { GetMessagesRequest } from "./src/types";

const app = express();

app.use(cors())
app.use(express.json());

app.get("/user/:userId", async function (req, res) {
  userController.get(req, res)
});
app.put("/user", async function (req, res) {
  userController.update(req, res)
});
app.post("/user/poke", async function (req, res) {
  userController.setPoke(req, res)
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
app.post('/ski-session/people', async function (req, res) {
  skiSessionController.findNearbyPeople(req, res)
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
app.post('/auth/google-sign-in', async function (req, res) {
  authController.googleSignIn(req, res)
});

app.get('/conversation', async function (req, res) {
  conversationController.getAllForUser(req, res)
});
app.get("/conversation/details/:conversationId", async function (req, res) {
  conversationController.getDetails(req, res)
});
app.get('/conversation/message', async function (req: Request<{}, {}, {}, GetMessagesRequest>, res) {
  conversationController.getAllMessagesForConversation(req, res)
});
app.post('/conversation/message', async function (req, res) {
  conversationController.addMessage(req, res)
});
app.post('/conversation/read', async function (req, res) {
  conversationController.markRead(req, res)
});

app.get('/bonjour', async function (req, res) {
  res.json({ message: `salut ${process.env.TEST_VAR} 1` })
})

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
