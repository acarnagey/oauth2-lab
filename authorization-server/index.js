const express = require("express");
const bodyParser = require("body-parser");
const OAuthServer = require("express-oauth-server");
const model = require("./model");
const { connect } = require("./db");

require("dotenv").config();

(async () => {
  await connect();
  const app = express();
  const port = 3001;
  const oauth = new OAuthServer({
    model,
    useErrorHandler: true,
    continueMiddleware: false,
  });
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.get("/public", async (req, res) => {
    res.status(200).json({ message: "public" });
  });

  // getClient -> getUserFromClient -> saveToken
  app.post(
    "/oauth/access_token",
    oauth.token({
      requireClientAuthentication: { authorization_code: false },
    })
  );

  // TODO:
  app.get("/oauth/authenticate", async (req, res, next) => {
    return res.render("authenticate");
  });

  // TODO:
  app.post(
    "/oauth/authenticate",
    async (req, res, next) => {
      // let UserModel = mongoose.model("User");
      req.body.user = { username: req.body.username };
      return next();
    },
    oauth.authorize({
      authenticateHandler: {
        handle: (req) => {
          return req.body.user;
        },
      },
    })
  );

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
})();
