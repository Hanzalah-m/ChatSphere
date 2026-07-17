const userService = require("./user.service");
const { formatUser } = require("../../utils/helpers");
const config = require("../../config");
const ApiError = require("../../utils/api.error");
const { searchUsers, getUserById } = require("../user/user.service");

const searchUsersController = async (req, res, next) => {
    try {
        const { query } = req.query;

        const users = await searchUsers(query, req.user.id);

        res.json({
            success: true,
            users
        });

    } catch (error) {
        next(error);
    }
};

// You will need this later to fetch the specific user's data for the chat header!
const getUserByIdController = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const user = await getUserById(userId);

        res.json({
            success: true,
            user
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    searchUsersController,
    getUserByIdController
};