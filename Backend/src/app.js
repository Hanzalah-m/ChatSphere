const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routers/auth.routes')
const app = express();
const cors = require('cors');

app.use(cors({
     origin: [
    "http://localhost:5173",
    "https://localhost:5170"
  ],
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);

module.exports = app;
