const mongoose = require("mongoose")

const tokenBlackList = new mongoose.Schema({
    token : {
        type : String,
        required: true,
        unique : true
    },
})

const tokenBlackListModel = mongoose.model("tokenBlackList",tokenBlackList);

module.exports = tokenBlackListModel