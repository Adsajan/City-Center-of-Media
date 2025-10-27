const jwt = require("jsonwebtoken");

module.exports = function generateToken(payload, options = {}) {
  const secret = process.env.JWT_SECRET || "change_me";
  const expiresIn = options.expiresIn || "7d";
  return jwt.sign(payload, secret, { expiresIn });
};

