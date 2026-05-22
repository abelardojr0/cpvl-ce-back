const jwt = require("jsonwebtoken");

const authMiddleware = (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ message: "Token nao informado." });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = decoded;
    return next();
  } catch {
    return response.status(401).json({ message: "Token invalido ou expirado." });
  }
};

const adminMiddleware = (request, response, next) => {
  if (request.user?.type !== "admin") {
    return response.status(403).json({ message: "Acesso restrito ao admin." });
  }

  return next();
};

module.exports = { authMiddleware, adminMiddleware };
