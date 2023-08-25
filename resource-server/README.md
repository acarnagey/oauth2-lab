some references:

- https://developer.auth0.com/resources/guides/api/express/basic-authorization
- https://github.com/auth0/node-oauth2-jwt-bearer
- https://auth0.github.io/node-oauth2-jwt-bearer/functions/auth.html

```bash
curl --request POST \
  --url https://....auth0.com/oauth/token \
  --header 'content-type: application/json' \
  --data '{"client_id":"...","client_secret":"...","audience":"http://localhost:3000","grant_type":"client_credentials"}'
```

unauth path

```bash
curl --location 'http://localhost:3000/public'
```

auth path

```bash
curl --location 'http://localhost:3000/' \
--header 'Authorization: Bearer ey...
```

jwt.io header

```json
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "rlkQmnXvOypQFgnwmatEG"
}
```

```json
{
  "iss": "https://....auth0.com/",
  "sub": "7KKAiBNWwMwgV9M0HVdh6dyWPD9ifLJW@clients",
  "aud": "http://localhost:3000",
  "iat": 1692981348,
  "exp": 1693067748,
  "azp": "7KKAiBNWwMwgV9M0HVdh6dyWPD9ifLJW",
  "gty": "client-credentials"
}
```

issuer-base-url//.well-known/openid-configuration

```json
{
  "issuer": "https://....auth0.com/",
  "authorization_endpoint": "https://....auth0.com/authorize",
  "token_endpoint": "https://....auth0.com/oauth/token",
  "device_authorization_endpoint": "https://....auth0.com/oauth/device/code",
  "userinfo_endpoint": "https://....auth0.com/userinfo",
  "mfa_challenge_endpoint": "https://....auth0.com/mfa/challenge",
  "jwks_uri": "https://....auth0.com/.well-known/jwks.json",
  "registration_endpoint": "https://....auth0.com/oidc/register",
  "revocation_endpoint": "https://....auth0.com/oauth/revoke",
  "scopes_supported": [
    "openid",
    "profile",
    "offline_access",
    "name",
    "given_name",
    "family_name",
    "nickname",
    "email",
    "email_verified",
    "picture",
    "created_at",
    "identities",
    "phone",
    "address"
  ],
  "response_types_supported": [
    "code",
    "token",
    "id_token",
    "code token",
    "code id_token",
    "token id_token",
    "code token id_token"
  ],
  "code_challenge_methods_supported": ["S256", "plain"],
  "response_modes_supported": ["query", "fragment", "form_post"],
  "subject_types_supported": ["public"],
  "id_token_signing_alg_values_supported": ["HS256", "RS256", "PS256"],
  "token_endpoint_auth_methods_supported": [
    "client_secret_basic",
    "client_secret_post",
    "private_key_jwt"
  ],
  "claims_supported": [
    "aud",
    "auth_time",
    "created_at",
    "email",
    "email_verified",
    "exp",
    "family_name",
    "given_name",
    "iat",
    "identities",
    "iss",
    "name",
    "nickname",
    "phone_number",
    "picture",
    "sub"
  ],
  "request_uri_parameter_supported": false,
  "request_parameter_supported": false,
  "token_endpoint_auth_signing_alg_values_supported": [
    "RS256",
    "RS384",
    "PS256"
  ]
}
```

issuer-base-url/.well-known/jwks.json

```json
{
  "keys": [
    {
      "kty": "RSA",
      "use": "sig",
      "n": "nm3VLENgxvrbVGNWB_jrx1w091QgEv13qAxodlsRrMOaDIVtmthn5c6R01e554-3zMJoL_INshT7oLGCvl6b7F22lQMNJL9SCvlaxog6No3FqKAtiw0nYOihC3x4SBN8QucXba1U57DAqWCqcJbZAGp27f3CFVLzcH4lwpDE6vMljkY79lB0cwhLjwtGddi7JZnHY4-yfsx_uUPlgA_nxiHxqsfCWNXJCmKc10paXn18wEZmrGY8gcH3YQQRB7eMXky5B0Ta0pjUb00GtzWQAHg3Gv8UdrMXTN3MNW61_JzT_IweR8VErC5aOYO7_WCdVt3k8IDrIEn8V7lB8uRT1Q",
      "e": "AQAB",
      "kid": "rlkQmnXvOypQFgnwmatEG",
      "x5t": "ET-mKgFUd0C9Pm9LbpjM_bA540A",
      "x5c": [
        "MIIDHTCCAgWgAwIBAgIJWhKP0Iyas0RtMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNVBAMTIWRldi1xYXFreHc1ZmI1Z3Yyb3V4LnVzLmF1dGgwLmNvbTAeFw0yMzA4MjUxNTMyMDJaFw0zNzA1MDMxNTMyMDJaMCwxKjAoBgNVBAMTIWRldi1xYXFreHc1ZmI1Z3Yyb3V4LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJ5t1SxDYMb621RjVgf468dcNPdUIBL9d6gMaHZbEazDmgyFbZrYZ+XOkdNXueePt8zCaC/yDbIU+6Cxgr5em+xdtpUDDSS/Ugr5WsaIOjaNxaigLYsNJ2DooQt8eEgTfELnF22tVOewwKlgqnCW2QBqdu39whVS83B+JcKQxOrzJY5GO/ZQdHMIS48LRnXYuyWZx2OPsn7Mf7lD5YAP58Yh8arHwljVyQpinNdKWl59fMBGZqxmPIHB92EEEQe3jF5MuQdE2tKY1G9NBrc1kAB4Nxr/FHazF0zdzDVutfyc0/yMHkfFRKwuWjmDu/1gnVbd5PCA6yBJ/Fe5QfLkU9UCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUiQvTA80PTky0aECSk9GhQFp8tJIwDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQCQwY+1odLibhDtNizncndcNcD1+VOTyQgPl7MZzrSTCO49FEudG8PYlqGbBJtlZKBTUPZ5YAgIxYR2KCEVMeGx/crCpO1nYzArcUGyECypRQznLiBPV+pKF0YuyXYsD4yMV20z4PdDlwkf1MSn0IN/Afy0csp7j4Utf2mgzktktiSlovVZqhJOjHe719GL6tPpJOwlxWbymudaS+mzb0UJqg3GqiuRe5U5AQUthqGX1i1FFnj77zF9nb9ENL3HcMn46IP3mp90b5+c9Ymx1cnpTYAReeTkfJOylls816AwLVZQC0FBqs9zaTp6UwiBECzTdUfFWwj4fbYSjtL7AZsa"
      ],
      "alg": "RS256"
    },
    {
      "kty": "RSA",
      "use": "sig",
      "n": "syfz0R1RPPtkNyCf7XEMm1KJozbkOqCIg7x72OTEf5RTpLi0_eoe4235krzYxuNnR11XntX80kQeXP1tGU4qRlDO1p05JL-0S2gNmGE8wJJ1TYDYBVFcjzjR5wPrxifYM2BwKCBuceYErMtvZosBMGDRdZGPqgrFwqMN8J7AIseMffhLbnrSEchtnaCsXaKa9NP9ivnLbzxH7f4fh9RfosU5fzHVpx00t3s8Zgr3yAZSsEFQHmdpaY_Thqt-r0KqCIqZMxgYBXqChKdWuELgkxkECUZnnoOLqK9RmijlA2ttxaUcqiVdrfVj5cfYrYgoks_mecZxjr9W2vslW8Pn7w",
      "e": "AQAB",
      "kid": "pCavYJbnj9AUO8L8bcwqh",
      "x5t": "7ET7gJ1rWRDhkjk8Qne8hXyupng",
      "x5c": [
        "MIIDHTCCAgWgAwIBAgIJYsV8iarL7bvIMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNVBAMTIWRldi1xYXFreHc1ZmI1Z3Yyb3V4LnVzLmF1dGgwLmNvbTAeFw0yMzA4MjUxNTMyMDJaFw0zNzA1MDMxNTMyMDJaMCwxKjAoBgNVBAMTIWRldi1xYXFreHc1ZmI1Z3Yyb3V4LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALMn89EdUTz7ZDcgn+1xDJtSiaM25DqgiIO8e9jkxH+UU6S4tP3qHuNt+ZK82MbjZ0ddV57V/NJEHlz9bRlOKkZQztadOSS/tEtoDZhhPMCSdU2A2AVRXI840ecD68Yn2DNgcCggbnHmBKzLb2aLATBg0XWRj6oKxcKjDfCewCLHjH34S2560hHIbZ2grF2imvTT/Yr5y288R+3+H4fUX6LFOX8x1acdNLd7PGYK98gGUrBBUB5naWmP04arfq9CqgiKmTMYGAV6goSnVrhC4JMZBAlGZ56Di6ivUZoo5QNrbcWlHKolXa31Y+XH2K2IKJLP5nnGcY6/Vtr7JVvD5+8CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUMW5lx8iWfKPJnsOgKGvR8gWK6hMwDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQA4qGsy3YO1CV2R7wO5wr7LHmfuLAye/KqL/3vTVtGOoVZ5fqbTpdV+DnXMd7IxiactoEFg2yZadsGq7O2BhjTzHwY9aqzsLgtPtngnCMlXC4lwzJCFx/6LwDGNPw5jXevbN/Y+N0apnSdu93XL6uu4E75qcXuwC+sW899RwUiIs49AJqg1p4oNuqKn3dI31/6mIL7zq5VB8FvgIoYpZQhaSmbaRgpg3+CDU/WHeiL5kwer5GfX1xM4P4EG4mKW/pQfADikxz+Tbmx/NEodTvBD3AXk4e6fBJ6GCg3I1en2u/jY/t7guKqxDdbQbf9gisu/bCHSWsuIUSXd1+DjErUH"
      ],
      "alg": "RS256"
    }
  ]
}
```

'/.well-known/oauth-authorization-server'
