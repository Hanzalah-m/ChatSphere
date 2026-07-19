import { io } from "socket.io-client";

let socket = null;

export function initSocket() {
  if (socket) return socket;

  const url = import.meta.env.VITE_API_URL || "http://localhost:3000";
  socket = io(url, { withCredentials: true });

  socket.on("connect", () => {
    console.log("Socket connected", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.warn("Socket connect_error:", err.message);
  });

  return socket;
}

export function getSocket() {
  if (!socket) return initSocket();
  return socket;
}

export default getSocket;
