require("dotenv").config();

const cors = require("cors");
const express = require("express");
const routes = require("./routes");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  }),
);
app.use(express.json());
app.use("/api", routes);

app.use((error, request, response, next) => {
  if (response.headersSent) {
    return next(error);
  }

  console.error(error);
  return response.status(500).json({ message: "Erro interno do servidor." });
});

module.exports = app;
