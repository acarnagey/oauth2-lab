const express = require("express");
const { MongoClient } = require("mongodb");
// const { auth } = require("express-oauth2-jwt-bearer");
const { auth } = require("./middlewares");
require("dotenv").config();

const jwtCheck = auth({
  audience: process.env.AUDIENCE,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

let db;
async function initDB() {
  const url = process.env.DB_CONNECTION;
  const client = new MongoClient(url);
  const dbName = "oauth2";
  await client.connect();
  console.log("Connected successfully to db");
  db = client.db(dbName);
}

(async () => {
  await initDB();

  const app = express();
  const port = 3000;

  // enforce on all endpoints
  // app.use(jwtCheck);

  app.get("/", jwtCheck, async (req, res) => {
    const collection = db.collection("documents");
    const documents = await collection.find().toArray();
    res
      .status(200)
      .json(
        documents.map((d) => ({ name: d.name, description: d.description }))
      );
  });

  app.get("/public", async (req, res) => {
    res.status(200).json({ message: "public" });
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
})();
