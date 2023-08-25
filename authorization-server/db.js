const { MongoClient } = require("mongodb");

let client;

const dbName = "oauth2";

async function connect() {
  if (!client) {
    const url = process.env.DB_CONNECTION;
    client = new MongoClient(url);
    await client.connect();
    console.log("Connected successfully to db");
  }
  return client;
}

const getClient = () => client;
const getDB = () => client.db(dbName);

module.exports = { connect, getClient, getDB };
