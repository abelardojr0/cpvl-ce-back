const { Router } = require("express");
const SettingsController = require("../controllers/SettingsController");
const {
  adminMiddleware,
  authMiddleware,
} = require("../middlewares/authMiddleware");

const settingsRoutes = Router();

settingsRoutes.get("/signature", authMiddleware, SettingsController.getSignature);
settingsRoutes.put(
  "/signature",
  authMiddleware,
  adminMiddleware,
  SettingsController.saveSignature,
);

module.exports = settingsRoutes;
