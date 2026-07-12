const router = require("express").Router();
const { registerUser, loginUser, logoutUser, getProfile } = require("./auth.controllers");
const { verifyToken } = require("../../middlewares/auth.middleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", verifyToken, getProfile);

module.exports = router;