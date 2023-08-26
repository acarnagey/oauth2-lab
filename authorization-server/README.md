References:
https://niceprogrammer.com/express-js-oauth-2-server-using-oauth2-server-package/
https://github.com/oauthjs/express-oauth-server
https://github.com/oauthjs/node-oauth2-server
https://oauth2-server.readthedocs.io/en/latest/

- [x] Client Credentials Grant
- [] Authorization Code Grant
- [] Password Credentials Grant
- [] Authorization Code with PKCE Grant
- [] Implicit

```bash
curl --location 'http://localhost:3001/oauth/access_token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'scope=read' \
--data-urlencode 'client_id=...' \
--data-urlencode 'client_secret=...'
```
```json
{
    "access_token": "...",
    "token_type": "Bearer",
    "expires_in": 3588,
    "scope": "read"
}
```

To generate rsa key
```bash
ssh-keygen -t rsa -m PEM
```
To generate rsa public key
```bash
openssl rsa -in id_rsa_pem_test  -pubout
```