const router = require("express").Router();
const multer = require("multer"); // <-- Import Multer
const { verifyToken } = require("../../middlewares/auth.middleware");
const upload = multer({ dest: 'temp/' });
const { searchUsersController, getUserByIdController } = require("../user/user.controller");

// Search for users to start a chat (e.g., GET /api/users/search?query=hanzalah)
router.get("/search", verifyToken, searchUsersController);

// Get a specific user's public profile by ID (e.g., GET /api/users/64a8f...)
router.get("/:userId", verifyToken, getUserByIdController);

module.exports = router;