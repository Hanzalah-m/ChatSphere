const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    const { username, email, password, profilePicture, name } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await userModel.findOne({
      $or: [{ username }, { email }]
    });

    if (userExists) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: passwordHash,
      profilePicture,
      name
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
  httpOnly: true,
  secure: true,        // required for HTTPS
  sameSite: "none",    // required for cross-site cookies
});

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        name: user.name
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};


const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await userModel.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
  httpOnly: true,
  secure: true,        // required for HTTPS
  sameSite: "none",    // required for cross-site cookies
});

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        name: user.name
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};


const logoutUser = (req, res) => {
  
  res.clearCookie("token");

  res.json({ message: "Logout successful" });
};


const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    

    res.status(200).json({
    message: "user fetched successfully",
    user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        name: user.name
      }
  })

  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getProfile
};
