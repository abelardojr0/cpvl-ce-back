const { Router } = require("express");
const authRoutes = require("./auth.routes");
const memberRoutes = require("./member.routes");

const routes = Router();

routes.get("/health", (request, response) => {
  return response.json({ status: "ok" });
});

routes.use("/auth", authRoutes);
routes.use("/members", memberRoutes);

module.exports = routes;
