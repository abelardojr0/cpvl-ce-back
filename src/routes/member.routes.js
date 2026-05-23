const { Router } = require("express");
const MemberController = require("../controllers/MemberController");
const {
  adminMiddleware,
  authMiddleware,
} = require("../middlewares/authMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");

const memberRoutes = Router();

memberRoutes.get("/", authMiddleware, adminMiddleware, asyncHandler(MemberController.list));
memberRoutes.get("/me/card", authMiddleware, asyncHandler(MemberController.myCard));
memberRoutes.get(
  "/:userId/card",
  authMiddleware,
  adminMiddleware,
  asyncHandler(MemberController.findByUserId),
);
memberRoutes.post("/", authMiddleware, adminMiddleware, asyncHandler(MemberController.create));
memberRoutes.put(
  "/:userId",
  authMiddleware,
  adminMiddleware,
  asyncHandler(MemberController.update),
);
memberRoutes.delete(
  "/:userId",
  authMiddleware,
  adminMiddleware,
  asyncHandler(MemberController.delete),
);

module.exports = memberRoutes;
