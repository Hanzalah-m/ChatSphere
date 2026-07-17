const userModel = require("../../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const ApiError = require("../../utils/api.error");
const { uploadToCloudinary } = require("../../config/uploadHelper");

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
    );
};

const register = async ({ username, email, password, profilePicture, name }) => {
    // Check if user already exists
    const existingUser = await userModel.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        throw new ApiError(400, "Username or email already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await userModel.create({
        username,
        email,
        password: passwordHash,
        profilePicture,
        name
    });

    // Generate token
    const token = generateToken(user._id);

    return { user, token };
};

const login = async (identifier, password) => {
    // Find user by email or username
    const user = await userModel.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user) {
        throw new ApiError(400, "Invalid credentials");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new ApiError(400, "Invalid credentials");
    }

    // Generate token
    const token = generateToken(user._id);

    return { user, token };
};

const getProfile = async (userId) => {
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};

const updateProfilePicture = async (userId, file) => {
    if (!file || !file.path) {
        throw new ApiError(400, "No file provided");
    }

    const imageUrl = await uploadToCloudinary(file.path);

    const user = await userModel.findByIdAndUpdate(
        userId,
        { profilePicture: imageUrl },
        { new: true }
    ).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};

const updateProfile = async (userId, { name, email, username }) => {
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (username !== undefined) updateData.username = username;

    const user = await userModel.findByIdAndUpdate(
        userId,
        updateData,
        {
            new: true,
            runValidators: true
        }
    ).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};

const deleteProfilePicture = async (userId) => {
    const user = await userModel.findByIdAndUpdate(
        userId,
        { $set: { profilePicture: null } },
        { new: true }
    ).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfilePicture,
    updateProfile,
    deleteProfilePicture
};