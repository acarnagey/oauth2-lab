const { createSecretKey } = require("crypto");
const { createRemoteJWKSet } = require("jose");

const getKeyFn = ({
  agent,
  cooldownDuration,
  timeoutDuration,
  cacheMaxAge,
  secret,
}) => {
  let getKeyFn;
  let prevjwksUri;

  const secretKey = secret && createSecretKey(Buffer.from(secret));

  return (jwksUri) => {
    if (secretKey) return () => secretKey;
    if (!getKeyFn || prevjwksUri !== jwksUri) {
      prevjwksUri = jwksUri;
      getKeyFn = createRemoteJWKSet(new URL(jwksUri), {
        agent,
        cooldownDuration,
        timeoutDuration,
        cacheMaxAge,
      });
    }
    return getKeyFn;
  };
};

module.exports = getKeyFn;
