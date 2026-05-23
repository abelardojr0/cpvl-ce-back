const { Router } = require("express");
const SettingsController = require("../controllers/SettingsController");
const {
  adminMiddleware,
  authMiddleware,
} = require("../middlewares/authMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");

const settingsRoutes = Router();

settingsRoutes.get("/signature", authMiddleware, asyncHandler(SettingsController.getSignature));
settingsRoutes.put(
  "/signature",
  authMiddleware,
  adminMiddleware,
  asyncHandler(SettingsController.saveSignature),
);

module.exports = settingsRoutes;
