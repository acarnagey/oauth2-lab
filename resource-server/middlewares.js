// express-oauth2-jwt-bearer
const getToken = require("./authUtil/getToken");
const jwtVerifier = require("./authUtil/jwtVerifier");

const auth = (opts = {}) => {
  const verifyJwt = jwtVerifier(opts);

  return async (req, res, next) => {
    try {
      const jwt = getToken(
        req.headers,
        req.query,
        req.body,
        !!req.is("urlencoded")
      );
      req.auth = await verifyJwt(jwt);
      next();
    } catch (e) {
      if (opts.authRequired === false) {
        next();
      } else {
        next(e);
      }
    }
  };
};

module.exports = { auth };
