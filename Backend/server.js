require('dotenv').config();
const http = require('http'); 
const app = require('./src/app');
const connectDb = require('./src/db/db');
const { initSocket } = require('./src/socket/socket'); 

connectDb();

const PORT = process.env.PORT || 3000;

// 1. Create the raw HTTP server using your Express app
const server = http.createServer(app);

// 2. Initialize Socket.io and pass the server to it
initSocket(server);

// 3. Start the server using `server.listen` instead of `app.listen`
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});