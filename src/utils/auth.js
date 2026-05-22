const jwt = require("jsonwebtoken");

const signToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      type: user.type,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );

module.exports = { signToken };
