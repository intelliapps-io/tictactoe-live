// import { WebSocketServer } from 'ws';
import { logger } from './helpers/logger';
import sio, { Server } from "socket.io";
import express, { Request, Response, NextFunction } from "express";
import http from "http";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { config } from './helpers/config';
import mongoose from 'mongoose';
import accountController from "./controllers/account"
import gameController from "./controllers/game"
import { authMiddleware, parseCookies, verifySocketCookies } from './helpers/auth';
import { handleGameSockets } from './controllers/gameSockets';

/**
 * Build Express App
 */

const cors_origin = ['localhost', 'http://localhost:19006', 'http://localhost:3000']
const app = express();
app.use(cors({ 
  origin: cors_origin,
  credentials: true
}));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware);
// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//   if (res.headersSent) {
//     return next(err);
//   }
//   logger.error(__filename, err);
//   res.status(err.status || 500).json({
//     message: err.message,
//     errors: err.errors,
//   });
// });

// express routes
app.get('/', (req, res) => {
  res.send('Backend running on port 3000')
})
app.use('/account', accountController)
app.use('/game', gameController)

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
    // allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

io.use(function (socket, next) {
  const { authenticated, userID } = verifySocketCookies(socket.handshake.headers.cookie)
  if (authenticated) {
    socket.handshake.auth.userID = userID;
    next()
  }
  else {
    logger.info(socket.handshake.headers.cookie)
    logger.info('Socket not authenticated, blocked')
    next(new Error('Authentication error'))
  }
})

io.on("connection", (socket) => {
  // logger.info('connected')
  handleGameSockets(socket)
});

/**
 * Start Server
 */

server.listen(config.SERVER_PORT, ()=> {
  console.log('Server is running on ' + config.SERVER_PORT)
})