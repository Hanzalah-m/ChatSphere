const mongooes = require('mongoose');

const userSchema = new mongooes.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
    email: {
    type: String,
    required: true,
    unique: true,
    },
    password: {
    type: String,
    required: true,
    },
    profilePicture: {
    type: String,
    default: "",
    },
    name: {
    type: String,
    default: "",
    }
}, { timestamps: true });

const User = mongooes.model('User', userSchema);

module.exports = User;