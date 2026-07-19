const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
require("dotenv").config();

let io;

/**
 * Initializes the Socket.io server and attaches it to the HTTP server.
 * @param {http.Server} server - The Node.js HTTP server instance
 */
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://chatsphere-lake.vercel.app"], // Your Vite frontend URL
      credentials: true, // Allow cookies to be sent
    },
  });

  // --- Socket.io Authentication Middleware ---
  io.use((socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      if (!cookieHeader) return next(new Error("No cookie provided"));

      // Parse the cookie string to find 'token'
      const cookies = cookieHeader.split(";").reduce((acc, c) => {
        const [key, val] = c.trim().split("=");
        acc[key] = val;
        return acc;
      }, {});

      const token = cookies.token;
      if (!token) return next(new Error("Authentication token missing"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id; // Attach user ID to the socket instance
      next();
    } catch (err) {
      console.error("Socket auth failed:", err.message);
      next(new Error("Authentication failed"));
    }
  });

  // --- Connection Handler ---
  io.on("connection", (socket) => {
    console.log(`⚡ [Socket]: User connected - ${socket.userId}`);

    // Join a specific chat room
    socket.on("join chat", (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.userId} joined chat: ${chatId}`);
    });

    // Handle typing event
    socket.on("typing", (chatId) => {
      // include the sender id so clients can ignore their own events if needed
      socket.to(chatId).emit("typing", { chatId, sender: socket.userId }); // Broadcast to others in the room
    });

    socket.on("stop typing", (chatId) => {
      socket.to(chatId).emit("stop typing", { chatId, sender: socket.userId });
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`⚡ [Socket]: User disconnected - ${socket.userId}`);
    });
  });
};

/**
 * Getter function to access the io instance from other files (like controllers)
 */
const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = {
  initSocket,
  getIO,
};