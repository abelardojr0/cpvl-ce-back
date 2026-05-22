const { Router } = require("express");
const MemberController = require("../controllers/MemberController");
const {
  adminMiddleware,
  authMiddleware,
} = require("../middlewares/authMiddleware");

const memberRoutes = Router();

memberRoutes.get("/", authMiddleware, adminMiddleware, MemberController.list);
memberRoutes.get("/me/card", authMiddleware, MemberController.myCard);
memberRoutes.post("/", authMiddleware, adminMiddleware, MemberController.create);

module.exports = memberRoutes;
