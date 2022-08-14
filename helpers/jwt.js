const { expressjwt: jwt } = require("express-jwt");

require("dotenv").config({ path: "../.env" });
const api = process.env.APP_URL;

const authJWT = () => {
  const secret = process.env.secret;
  return jwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevokedAdmin,
  }).unless({
    path: [
      { url: /\api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\api\/v1\/Category(.*)/, methods: ["GET", "OPTIONS"] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
};

async function isRevokedAdmin(req, token) {
  if (!token.payload.isAdmin) {
    return true;
  }

  return false;
}
module.exports = authJWT;
