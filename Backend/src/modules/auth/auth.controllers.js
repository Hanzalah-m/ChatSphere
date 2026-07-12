const authService = require("./auth.service");
const { formatUser } = require("../../utils/helpers");
const config = require("../../config");
const ApiError = require("../../utils/api.error");

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, profilePicture, name } = req.body;

    if (!username || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const { user, token } = await authService.register({
      username,
      email,
      password,
      profilePicture,
      name
    });

    res.cookie("token", token, config.COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: formatUser(user)
    });

  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const { user, token } = await authService.login(identifier, password);

    res.cookie("token", token, config.COOKIE_OPTIONS);

    res.json({
      success: true,
      message: "Login successful",
      user: formatUser(user)
    });

  } catch (error) {
    next(error);
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({
    success: true,
    message: "Logout successful"
  });
};

const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);

    res.json({
      success: true,
      message: "User fetched successfully",
      user: formatUser(user)
    });

  } catch (error) {
    next(error);
  }
};

const updateProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(400, "No file uploaded");
    }

    const user = await authService.updateProfilePicture(req.user.id, req.file.path);

    res.json({
      success: true,
      message: "Profile picture updated successfully",
      user: formatUser(user)
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfilePicture
};