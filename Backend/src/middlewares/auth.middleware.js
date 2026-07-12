const tokenBlackList = require("../models/tokenBlacklist.model");
const jwt = require("jsonwebtoken");
const config = require("../config");
const ApiError = require("../utils/api.error");

async function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return next(new ApiError(401, "Not authenticated"));
  }

  try {
    // Check if token is blacklisted
    const blacklisted = await tokenBlackList.findOne({ token });

    if (blacklisted) {
      return next(new ApiError(401, "Token expired, login again"));
    }

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Invalid token"));
    }
    if (err.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token expired, login again"));
    }
    next(err);
  }
}

module.exports = { verifyToken };