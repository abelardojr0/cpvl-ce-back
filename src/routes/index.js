const { Router } = require("express");
const authRoutes = require("./auth.routes");
const memberRoutes = require("./member.routes");
const settingsRoutes = require("./settings.routes");

const routes = Router();

routes.get("/health", (request, response) => {
  return response.json({ status: "ok" });
});

routes.use("/auth", authRoutes);
routes.use("/members", memberRoutes);
routes.use("/settings", settingsRoutes);

module.exports = routes;
