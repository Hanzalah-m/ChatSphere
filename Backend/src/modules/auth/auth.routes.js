const router = require("express").Router();
const multer = require("multer"); // <-- Import Multer
const { verifyToken } = require("../../middlewares/auth.middleware");
const upload = multer({ dest: 'temp/' }); 
const { registerUser, loginUser, logoutUser, getProfile, updateProfilePicture } = require("./auth.controllers");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", verifyToken, getProfile);


router.put("/profile/picture", verifyToken, upload.single('image'), updateProfilePicture);

module.exports = router;