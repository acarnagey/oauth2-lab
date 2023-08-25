const jwt = require("jsonwebtoken");
const fs = require("fs");
const { getDB } = require("./db");

async function getClient(clientId, clientSecret) {
  console.log("getClient");
  const client = await getDB().collection("clients").findOne({
    clientId,
    clientSecret,
  });
  return client;
}

function getUserFromClient() {
  console.log("getUserFromClient");
  // return UserModel.findById(client.user);
  return {};
}

async function saveToken(token, client, user) {
  console.log("saveToken");
  const accessToken = {
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    client,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    user,
    scope: token.scope,
  };
  const privateKey = process.env.AUTH_SECRET;
  const accessJWT = jwt.sign(
    {
      iss: "http://localhost:3001", // issuer, who created and signed this token
      sub: client._id + "@clients", // subject, whom the token refers to
      aud: "http://localhost:3000",
      iat: Math.floor(new Date().getTime() / 1000),
      exp: Math.floor(new Date(token.accessTokenExpiresAt) / 1000),
      // azp: "7KKAiBNWwMwgV9M0HVdh6dyWPD9ifLJW",
      gty: "client-credentials",
    },
    privateKey,
    {
      algorithm: "RS256",
      header: { kid: "rvPpCUdtQ164i+49E7hFr++7euHoU7Hm/hvIXVPB1us" },
    }
  );
  accessToken.accessToken = accessJWT;
  await getDB().collection("accesstokens").insertOne(accessToken);
  return accessToken;
}

function saveAuthorizationCode() {
  console.log("saveAuthorizationCode");
  // TODO:
}

function getAccessToken(bearerToken) {
  console.log("getAccessToken");
  // TODO:
}

function getRefreshToken(bearerToken) {
  console.log("getRefreshToken");
  // TODO:
}

function getUser(username, password) {
  console.log("getUser");
  // TODO:
}

// function dump() {
//   console.log('clients', clients);
//   console.log('tokens', tokens);
//   console.log('users', users);
// };

const model = {
  getAccessToken,
  getRefreshToken,
  getClient,
  saveToken,
  getUser,
  saveAuthorizationCode,
  getUserFromClient,
};

module.exports = model;
