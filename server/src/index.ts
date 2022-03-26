import { WebSocketServer } from 'ws';
import { logger } from './helpers/logger';
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { config } from './helpers/config';
import mongoose from 'mongoose';
import accountController from "./controllers/account"
import { authMiddleware } from './helpers/auth';

/**
 * Connect MongoDB
 */

mongoose.connect(config.MONGO_URI, () => { 
  console.log('Database connected')
})

/** 
 * Create Websocket Server
 */

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    logger.info('received: ' + data);
  });

  ws.send('something');
});

/**
 * Build Express App
 */

// express config
const app = express();
app.use(cors({ 
  origin: ['localhost'],
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

// express start
app.listen(config.SERVER_PORT, ()=> {
  console.log('Server is running on ' + config.SERVER_PORT)
})