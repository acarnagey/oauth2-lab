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

  // jwks = jwk[]
  app.get("/.well-known/jwks.json", async (req, res) => {
    // FIXME: I think you could derive this programmatically
    res.status(200).json({
      keys: [
        {
          kty: "RSA",
          n: "1pyEFUKUoS-Zy9_D588Z-YERpNNBel5gvAcmp6c3mt_LP1WRsgNKAJXt0nWv830P7kkX2EIYZDlpNMWeXM78zsAvNEFfraHU6nJuyv4wVVQIi_SjH10cKtIaCVRWcDFqDbM4s2YoJ2oegiB95vFlOkaw43Ku7BHZNejWSSnO0MWeSIi83n7tZt2vm5PK7LoBXqNpOMfbvtZVg_ycmoU1kw2_SrxsFFfQh99ohUflVlza8VdeuLLN9hoQ9BqlKl241J6e-iKCp4AtgciDBk1qoCA5znr9zZeTYKe_CXoBXp-IzS1S8KdeqSsPe8GHfRPs9C88WDkV4_YDnuOBDnkaRL4c52WvhGjPlrDN0fzSbkaicWp8_GpKmBlCpwKW0kJPQYaFaOl_rgxI_vdxVglPQKWx-CSNAPFIZ_MWsnb1QzzExbhSSm16wSSo2oQW-VpIczuRNsjdT2qPFMOZhplBXTl4XRdnIy91ksBHtdg4reIjz_8acasMeweX1jZGSA4l",
          e: "AQAB",
          alg: "RS256",
          kid: "rvPpCUdtQ164i+49E7hFr++7euHoU7Hm/hvIXVPB1us",
          use: "sig",
        },
      ],
    });
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
