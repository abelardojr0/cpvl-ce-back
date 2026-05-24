const { Router } = require("express");
const AuthController = require("../controllers/AuthController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");

const authRoutes = Router();

authRoutes.post("/login", asyncHandler(AuthController.login));
authRoutes.get("/me", authMiddleware, asyncHandler(AuthController.me));

module.exports = authRoutes;
