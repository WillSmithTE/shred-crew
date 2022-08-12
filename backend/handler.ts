import express from "express";
import serverless from "serverless-http";
import { resortService } from "./src/service/ResortService";
import { userService } from "./src/service/UserService";

const app = express();

app.use(express.json());

app.get("/user/:userId", async function (req, res) {
  userService.get(req, res)
});

app.post("/users", async function (req, res) {
  userService.add(req, res)
});

app.get("/resort", async function (req, res) {
  resortService.getAll(req, res)
});

app.post('/resort/coords', async function (req, res) {
  resortService.getAllWithinCoordinates(req, res)
})

app.get('/bonjour', async function (req, res) {
  res.json({ message: 'salut' })
})

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
