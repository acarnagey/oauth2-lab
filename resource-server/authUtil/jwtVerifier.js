const { strict: assert } = require("assert");
const { jwtVerify } = require("jose");
const discovery = require("./discovery");
const getKeyFn = require("./getKeyFn");
const { validate, defaultValidators } = require("./validate");

const ASYMMETRIC_ALGS = [
  "RS256",
  "RS384",
  "RS512",
  "PS256",
  "PS384",
  "PS512",
  "ES256",
  "ES256K",
  "ES384",
  "ES512",
  "EdDSA",
];
const SYMMETRIC_ALGS = ["HS256", "HS384", "HS512"];

const jwtVerifier = ({
  issuerBaseURL = process.env.ISSUER_BASE_URL,
  jwksUri = process.env.JWKS_URI,
  issuer = process.env.ISSUER,
  audience = process.env.AUDIENCE,
  secret = process.env.SECRET,
  tokenSigningAlg = process.env.TOKEN_SIGNING_ALG,
  agent,
  cooldownDuration = 30000,
  timeoutDuration = 5000,
  cacheMaxAge = 600000,
  clockTolerance = 5,
  maxTokenAge,
  strict = false,
  validators: customValidators,
}) => {
  let validators;
  let allowedSigningAlgs;

  assert(
    issuerBaseURL || (issuer && jwksUri) || (issuer && secret),
    "You must provide an 'issuerBaseURL', an 'issuer' and 'jwksUri' or an 'issuer' and 'secret'"
  );
  assert(
    !(secret && jwksUri),
    "You must not provide both a 'secret' and 'jwksUri'"
  );
  assert(audience, "An 'audience' is required to validate the 'aud' claim");
  assert(
    !secret || (secret && tokenSigningAlg),
    "You must provide a 'tokenSigningAlg' for validating symmetric algorithms"
  );
  assert(
    secret || !tokenSigningAlg || ASYMMETRIC_ALGS.includes(tokenSigningAlg),
    `You must supply one of ${ASYMMETRIC_ALGS.join(
      ", "
    )} for 'tokenSigningAlg' to validate asymmetrically signed tokens`
  );
  assert(
    !secret || (tokenSigningAlg && SYMMETRIC_ALGS.includes(tokenSigningAlg)),
    `You must supply one of ${SYMMETRIC_ALGS.join(
      ", "
    )} for 'tokenSigningAlg' to validate symmetrically signed tokens`
  );

  const getDiscovery = discovery({
    issuerBaseURL,
    agent,
    timeoutDuration,
    cacheMaxAge,
  });

  const getKeyFnGetter = getKeyFn({
    agent,
    cooldownDuration,
    timeoutDuration,
    cacheMaxAge,
    secret,
  });

  return async (jwt) => {
    try {
      if (issuerBaseURL) {
        const {
          jwks_uri: discoveredJwksUri,
          issuer: discoveredIssuer,
          id_token_signing_alg_values_supported:
            idTokenSigningAlgValuesSupported,
        } = await getDiscovery();
        jwksUri = jwksUri || discoveredJwksUri;
        issuer = issuer || discoveredIssuer;
        allowedSigningAlgs = idTokenSigningAlgValuesSupported;
      }
      // ||= means if object is null then assign a value to it.
      const defaultValidatorObj = defaultValidators(
        issuer,
        audience,
        clockTolerance,
        maxTokenAge,
        strict,
        allowedSigningAlgs,
        tokenSigningAlg
      )
      validators ||= {
        ...defaultValidatorObj,
        ...customValidators,
      };
      const key = getKeyFnGetter(jwksUri);
      const { payload, protectedHeader: header } = await jwtVerify(jwt, key);
      await validate(payload, header, validators);
      return { payload, header, token: jwt };
    } catch (e) {
      throw e;
      // throw new Error("Invalid Token Error " + e.message);
    }
  };
};

module.exports = jwtVerifier;
