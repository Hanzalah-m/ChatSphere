const userModel = require("../../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const ApiError = require("../../utils/api.error");
const { uploadToCloudinary } = require("../../config/uploadHelper");

const searchUsers = async (query, currentUserId) => {
    if (!query || query.trim() === "") {
        throw new ApiError(400, "Search query cannot be empty");
    }

    // Find users by username or name, but NEVER return the current user
    const users = await userModel.find({
        $and: [
            {
                $or: [
                    { username: { $regex: query, $options: "i" } },
                    { name: { $regex: query, $options: "i" } }
                ]
            },
            { _id: { $ne: currentUserId } } // Exclude logged-in user
        ]
    }).select("-password"); // NEVER send passwords to the frontend

    return users;
};

// You will need this later when opening a chat with a searched user!
const getUserById = async (userId) => {
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};

module.exports = {
    searchUsers,
    getUserById
};