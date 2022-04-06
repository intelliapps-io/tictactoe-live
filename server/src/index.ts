// import { WebSocketServer } from 'ws';
import { logger } from './helpers/logger';
import { Server } from "socket.io";
import express, { Request, Response, NextFunction } from "express";
import http from "http";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { config } from './helpers/config';
import mongoose from 'mongoose';
import accountController from "./controllers/account"
import gameController from "./controllers/game"
import jwt from "jsonwebtoken"
import { authMiddleware, withAuth } from './helpers/auth';
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

app.get('/', (req, res) => {
  res.send('Backend running on port 3000')
})

// express routes
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

// io.use(function(socket, next){
//   if (socket.handshake.auth.sessionID){
//     // jwt.verify(socket.handshake.query.token, 'SECRET_KEY', function(err, decoded) {
//     //   if (err) return next(new Error('Authentication error'));
//     //   socket.decoded = decoded;
//     //   next();
//     // });
//     next()
//   }
//   else {
//     next(new Error('Authentication error'));
//   } 
// })

io.on("connection", (socket) => {
  logger.info('connected')
  handleGameSockets(socket)
});

/**
 * Start Server
 */

server.listen(config.SERVER_PORT, ()=> {
  console.log('Server is running on ' + config.SERVER_PORT)
})