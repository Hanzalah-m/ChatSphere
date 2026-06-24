const express = require('express');
const cookieParser = require('cookie-parser');
const authController = require("../controllers/auth.controllers")

const authRouter = express.Router();


authRouter.post('/register', authController.registerUser);
authRouter.post('/login', authController.loginUser);
authRouter.post('/logout', authController.logoutUser);
authRouter.get('/profile', authController.getProfile);

module.exports = authRouter;