const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware")

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", authMiddleware, userController.getacc);
router.put("/profile", authMiddleware, userController.updateacc);
router.delete("/", authMiddleware, userController.deleteacc);
module.exports = router;