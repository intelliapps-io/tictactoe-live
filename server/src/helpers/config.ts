import path from 'path';
import { readFileSync } from 'fs';
const ROOT_DIR = path.join(__dirname, "..", "..");

export interface IConfig {
  ROOT_DIR: string
  HOST_BASE_URL: string
  ENDPOINTS_DIR: string
  SERVER_PORT: number
  MONGO_URI: string
}

// App config
export const config: IConfig = {

  // The root directory of this project. 
  ROOT_DIR: ROOT_DIR,

  // The port to access this app from the host.
  HOST_BASE_URL: process.env.HOST_BASE_URL ? process.env.HOST_BASE_URL : "localhost",

  // The port the server listens on.
  SERVER_PORT: process.env.SERVER_PORT ? Number.parseInt(process.env.SERVER_PORT) : 3000,

  // Express routes
  ENDPOINTS_DIR: path.join(ROOT_DIR, "src", "endpoints"),

  // MongoDB connection string
  MONGO_URI: process.env.MONGO_URI ? process.env.MONGO_URI : 'mongodb://localhost:27018',
}