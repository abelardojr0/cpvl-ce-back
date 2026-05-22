const { Router } = require("express");
const AuthController = require("../controllers/AuthController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const authRoutes = Router();

authRoutes.post("/login", AuthController.login);
authRoutes.get("/me", authMiddleware, AuthController.me);
authRoutes.post("/forgot-password", AuthController.forgotPassword);

module.exports = authRoutes;
