const { Router } = require("express");
const MemberController = require("../controllers/MemberController");
const {
  adminMiddleware,
  authMiddleware,
} = require("../middlewares/authMiddleware");

const memberRoutes = Router();

memberRoutes.get("/", authMiddleware, adminMiddleware, MemberController.list);
memberRoutes.get("/me/card", authMiddleware, MemberController.myCard);
memberRoutes.get(
  "/:userId/card",
  authMiddleware,
  adminMiddleware,
  MemberController.findByUserId,
);
memberRoutes.post("/", authMiddleware, adminMiddleware, MemberController.create);
memberRoutes.put(
  "/:userId",
  authMiddleware,
  adminMiddleware,
  MemberController.update,
);
memberRoutes.delete(
  "/:userId",
  authMiddleware,
  adminMiddleware,
  MemberController.delete,
);

module.exports = memberRoutes;
