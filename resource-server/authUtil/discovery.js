const { URL } = require("url");
const fetch = require("./fetch");
const { strict: assert } = require("assert");

const OIDC_DISCOVERY = "/.well-known/openid-configuration";
const OAUTH2_DISCOVERY = "/.well-known/oauth-authorization-server";

const assertIssuer = (data) =>
  assert(data.issuer, `'issuer' not found in authorization server metadata`);

const discover = async ({ issuerBaseURL: uri, agent, timeoutDuration }) => {
  const url = new URL(uri);

  if (url.pathname.includes("/.well-known/")) {
    const data = await fetch(url, { agent, timeoutDuration });
    assertIssuer(data);
    return data;
  }

  const pathnames = [];
  if (url.pathname.endsWith("/")) {
    pathnames.push(`${url.pathname}${OIDC_DISCOVERY.substring(1)}`);
  } else {
    pathnames.push(`${url.pathname}${OIDC_DISCOVERY}`);
  }
  if (url.pathname === "/") {
    pathnames.push(`${OAUTH2_DISCOVERY}`);
  } else {
    pathnames.push(`${OAUTH2_DISCOVERY}${url.pathname}`);
  }

  for (const pathname of pathnames) {
    try {
      const wellKnownUri = new URL(pathname, url);
      const data = await fetch(wellKnownUri, {
        agent,
        timeoutDuration,
      });
      assertIssuer(data);
      return data;
    } catch (err) {
      // noop
    }
  }

  throw new Error("Failed to fetch authorization server metadata");
};

const discovery = (opts) => {
  let discovery;
  let timestamp = 0;

  return () => {
    const now = Date.now();

    if (!discovery || now > timestamp + opts.cacheMaxAge) {
      timestamp = now;
      discovery = discover(opts).catch((e) => {
        discovery = undefined;
        throw e;
      });
    }
    return discovery;
  };
};

module.exports = discovery;
