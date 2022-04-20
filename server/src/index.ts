// import { WebSocketServer } from 'ws';
import { logger } from './helpers/logger';
import { Server } from "socket.io";
import { join } from 'path'
import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { config } from './helpers/config';
import mongoose from 'mongoose';
import accountController from "./controllers/account"
import gameController from "./controllers/game"
import { authMiddleware } from './helpers/auth';
import { handleGameSockets } from './controllers/gameSockets';

/**
 * Build Express App
 */

const cors_origin = config.NODE_ENV === 'production' ? [config.HOST_BASE_URL] : ['localhost', 'http://localhost:19006', 'http://localhost:3000'] 
const app = express();
app.use(cors({ 
  origin: cors_origin,
  credentials: true
}));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware);
app.use('/account', accountController)
app.use('/game', gameController)

// Production Send Files
if (true) {
  const buildFolder = join(__dirname, "../", "../", "client", "web-build");
  const indexHtml = join(buildFolder, "index.html");
  app.use("/", express.static(buildFolder))
  app.get('/', (req, res, next) => {
    res.sendFile(indexHtml);
  })
}

// express http server
const server = http.createServer(app);

/**
 * Connect MongoDB
 */

mongoose.connect(config.MONGO_URI, () => { 
  console.log('Database connected')
})

/**
 * Socket.IO Server
 */ 

const io = new Server(server, {
  cors: {
    origin: cors_origin,
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.use((socket, next) => {
  const userID = socket.handshake.auth.userID;
  if (!userID) {
    logger.info('NO USER ID')
    return next(new Error("invalid username"));
  }
  next();
});

io.on("connection", (socket) => {
  // join room
  socket.join(socket.handshake.auth.userID)

  handleGameSockets(socket)
});

/**
 * Start Server
 */

server.listen(config.PORT, ()=> {
  console.log('Server is running on ' + config.PORT)
})