const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./modules/auth/auth.routes");
const errorHandler = require("./middlewares/errorHandler");
const userRoutes = require("./modules/user/user.routes");
const chatRoutes = require("./modules/chat/chat.routes");

const app = express();
app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://localhost:5170"
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);

// Error handler - MUST be last, after all routes
app.use(errorHandler);

module.exports = app;