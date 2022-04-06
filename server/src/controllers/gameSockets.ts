import { Socket } from "socket.io";
import { logger } from "../helpers/logger";

//https://socket.io/get-started/private-messaging-part-2/

interface IGameSession {
  gameID: number
  userID1: string
  userID2: string | null
}

class InMemorySessionStore {
  sessions: Map<number, IGameSession>

  constructor() {
    this.sessions = new Map()
  }

  findGame(gameID: number) {
    return this.sessions.get(gameID)
  }

  saveSession(gameID: number, users: IGameSession) {
    this.sessions.set(gameID, users)
  }

  removeSession(gameID: number) {
    this.sessions.delete(gameID)
  }

  findAllSessions() {
    return [...this.sessions.values()]
  }
}

const gameSessions = new InMemorySessionStore()

export function handleGameSockets(socket: Socket) {
  // send a message to the client
  socket.emit("hello from server", 1, "2", { 3: Buffer.from([4]) })

  // receive a message from the client
  socket.on("request_start_new_game", (data) => {
    logger.info(data)
    if (socket.handshake.auth.sessionID) {
      const gameID = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
      gameSessions.saveSession(gameID, { gameID, userID1: socket.handshake.auth.sessionID, userID2: null })
      socket.emit("response_start_new_game", gameSessions.findGame(gameID))
    }

    
    
  });


}