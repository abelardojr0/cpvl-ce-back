require("dotenv").config();

const cors = require("cors");
const express = require("express");
const routes = require("./routes");

const app = express();

const parseOrigins = (value = "") =>
  value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = [
  ...parseOrigins(process.env.FRONTEND_URL),
  ...parseOrigins(process.env.FRONTEND_URLS),
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origem nao permitida pelo CORS."));
    },
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
