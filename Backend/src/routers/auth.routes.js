const express = require('express');
const cookieParser = require('cookie-parser');
const authController = require("../controllers/auth.controllers")
const authMiddleware = require("../middlewares/auth.middleware")

const authRouter = express.Router();


authRouter.post('/register', authController.registerUser);
authRouter.post('/login', authController.loginUser);
authRouter.post('/logout', authController.logoutUser);
authRouter.get('/profile', authMiddleware.authUser, authController.getProfile);

module.exports = authRouter;