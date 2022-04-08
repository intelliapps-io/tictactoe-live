import { Socket } from "socket.io";
import { logger } from "../helpers/logger";
import { IUser, User } from "../models/userModel";

//https://socket.io/get-started/private-messaging-part-2/

interface IGameSession {
  gameID: string
  user1ID: string
  user2ID: string | null
}

interface IPlayerInfo {
  isSymbolX: boolean
  isTurn: boolean
}

interface IRequestJoinExistingGame {
  gameID: string
}

class InMemorySessionStore {
  sessions: Map<string, IGameSession>

  constructor() {
    this.sessions = new Map()
  }

  findGame(gameID: string) {
    return this.sessions.get(gameID)
  }

  saveSession(gameID: string, users: IGameSession) {
    this.sessions.set(gameID, users)
  }

  removeSession(gameID: string) {
    this.sessions.delete(gameID)
  }

  findAllSessions() {
    return [...this.sessions.values()]
  }
}

const gameSessions = new InMemorySessionStore()

export function handleGameSockets(socket: Socket) {
  const userID = socket.handshake.auth.userID

  socket.on("request_start_new_game", (payload: any, callback: (res: IGameSession) => void) => {
    socket.join(userID)
    
    const gameID = `${Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000}`
    gameSessions.saveSession(gameID, {
      gameID,
      user1ID: userID,
      user2ID: null
    })

    // leave other game rooms
    socket.rooms.forEach((room) => {
      if (room.length === 6)
        socket.leave(room)
    })

    // join game room
    socket.join(gameID)

    try {
      callback(gameSessions.findGame(gameID) as IGameSession)
    } catch (err) { }
  })

  socket.on("request_join_existing_game", async (payload: IRequestJoinExistingGame, callback: (res: IGameSession) => void) => {
    socket.join(userID)
    let session = gameSessions.findGame(payload.gameID)

    if (!session)
      return logger.info("Error, game session not found")

    if (session.user1ID === userID)
      return logger.info("Error, you cannot join your own game")

    if (session.user2ID && session.user2ID !== userID)
      return logger.info("Error, this game is full")

    session.user2ID = userID

    gameSessions.saveSession(payload.gameID, session)

    // leave other game rooms
    // socket.rooms.forEach((room) => {
    //   if (room.length === 6)
    //     socket.leave(room)
    // })

    // join user to room
    socket.join(payload.gameID)

    callback(session)

    // send game data
    socket.to(payload.gameID).emit("response_gamesession_update", session)

    const user1 = await User.findById(session.user1ID)
    const user2 = await User.findById(session.user2ID)
    const player1Info: IPlayerInfo = {
      isSymbolX: true,
      isTurn: true
    };
    const player2Info: IPlayerInfo = {
      isSymbolX: false,
      isTurn: false
    };

    // send user1 opponent data
    if (user2) {
      socket.to(session.user1ID).emit("response_set_opponent", {
        _id: user2._id,
        email: user2.email,
        firstName: user2.firstName,
        lastName: user2.lastName,
        totalGames: user2.totalGames,
        totalWins: user2.totalWins
      })
      socket.to(session.user1ID).emit("response_player_info", player1Info)
    }

    
    // send user2 opponent data
    if (user1 && session.user2ID) {
      socket.to(session.user2ID).emit("response_set_opponent", {
        _id: user1._id,
        email: user1.email,
        firstName: user1.firstName,
        lastName: user1.lastName,
        totalGames: user1.totalGames,
        totalWins: user1.totalWins
      })
      socket.to(session.user2ID).emit("response_player_info", player2Info)
    }
    
    
  })

  // socket.on("request_exit_game", (gameID: string, callback: () => void) => {
  //   let session = gameSessions.findGame(gameID)

  //   if (!session)
  //     return logger.info("Error, game session not found")
    
  //   gameSessions.removeSession(gameID)

  //   socket.leave(gameID)

  //   callback()
  // })
}