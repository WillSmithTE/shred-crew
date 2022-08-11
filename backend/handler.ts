import * as AWS from "aws-sdk";
import express from "express";
import serverless from "serverless-http";
import { bootstrapResorts } from "./src/bootstrapResorts";
import { dynamoDbClient, RESORTS_TABLE, USERS_TABLE } from "./src/database";

const app = express();

app.use(express.json());

app.get("/user/:userId", async function (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.get(params).promise();
    if (Item) {
      const { userId, name } = Item;
      res.json({ userId, name });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "userId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive user" });
  }
});

app.get('/bonjour', async function (req, res) {
  res.json({ message: 'salut' })
})

app.post("/users", async function (req, res) {
  const { userId, name } = req.body;
  if (typeof userId !== "string") {
    res.status(400).json({ error: 'userId must be a string' });
  } else if (typeof name !== "string") {
    res.status(400).json({ error: 'name must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: userId,
      name: name,
    },
  };

  try {
    await dynamoDbClient.put(params).promise();
    res.json({ userId, name });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create user" });
  }
});

app.get("/resort", async function (req, res) {
  const params = {
    TableName: RESORTS_TABLE,
  };

  try {
    const { Items } = await dynamoDbClient.scan(params).promise();
    if (Items) {
      res.json(Items);
    } else {
      res
        .status(404)
        .json({ error: '?' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "??" });
  }
});


app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
