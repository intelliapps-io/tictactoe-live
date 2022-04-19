import { Socket } from "socket.io";
import { calcGameWin } from "../helpers/calcGameWin";
import { logger } from "../helpers/logger";
import { User } from "../models/userModel";
import mongoose from 'mongoose';

//https://socket.io/get-started/private-messaging-part-2/

type BoardCellState = 'X' | 'O' | null

export interface IWinResult {
  winCells: number[][]
  winSymbol: "X" | "O"
  winnerID: string
  isTie: boolean
}

export interface IGameSession {
  gameID: string
  user1ID: string
  user2ID: string | null
  board: [
    [BoardCellState, BoardCellState, BoardCellState],
    [BoardCellState , BoardCellState, BoardCellState],
    [BoardCellState , BoardCellState, BoardCellState]
  ]
  playerTurnID: string
  player1Symbol: 'X' | 'O'
  player2Symbol: 'X' | 'O'
  win: IWinResult | null
}

interface IRequestGameMove {
  gameID: string
  cellRow: number
  cellCol: number
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

  /**
   * Start New Game
   * 
   * 
   */
  socket.on("request_start_new_game", (payload: any, callback: (res: IGameSession) => void) => {
    const gameID = `${Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000}`
    gameSessions.saveSession(gameID, {
      gameID,
      user1ID: userID,
      user2ID: null,
      board: [[null, null, null], [null, null, null], [null, null, null]],
      playerTurnID: userID,
      player1Symbol: 'X',
      player2Symbol: 'O',
      win: null
    })

    // leave other game rooms
    // socket.rooms.forEach((room) => {
    //   if (room.length === 6)
    //     socket.leave(room)
    // })

    // join game room
    socket.join(gameID)

    try {
      callback(gameSessions.findGame(gameID) as IGameSession)
    } catch (err) { }
  })

  /**
   * Join Game
   * 
   * 
   */
  socket.on("request_join_existing_game", async (payload: IRequestJoinExistingGame, callback: (res: IGameSession) => void) => {
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
    }

    // send user2 opponent data
    if (user1) {
      socket.emit("response_set_opponent", {
        _id: user1._id,
        email: user1.email,
        firstName: user1.firstName,
        lastName: user1.lastName,
        totalGames: user1.totalGames,
        totalWins: user1.totalWins
      })
    }
  })

  /**
   * Game Move
   * 
   * 
   */
  socket.on("request_game_move", async (payload: IRequestGameMove) => {
    let session = gameSessions.findGame(payload.gameID)

    if (!session)
      return logger.info("Error, game session not found")
    
    if (!(payload.cellCol <= 3 && payload.cellCol >= 0 && payload.cellRow >=0 && payload.cellRow <= 3))
      return logger.info("Error, cell refrence error")
    
    const cellState = session.board[payload.cellRow][payload.cellCol]
      
    if (cellState !== null)
      return logger.info("Error, cell already played")
    
    // get user symbol
    let symbol: 'X' | 'O' = 'O'
    if (session.playerTurnID === session.user1ID)
      symbol = session.player1Symbol
    else
      symbol = session.player2Symbol
    
    // update cell
    session.board[payload.cellRow][payload.cellCol] = symbol

    
    
    
    
    // swap player turn
    if (session.playerTurnID === session.user1ID)
      session.playerTurnID = session.user2ID!
    else
      session.playerTurnID = session.user1ID
    
    // set win status
    session.win = calcGameWin(session)

    // update total wins & games
    let user1Record = await User.findById(session.user1ID)
    let user2Record = await User.findById(session.user2ID)

   
    if(user1Record != null && user2Record != null && session.win?.winnerID === session.user1ID){
      user1Record.totalWins ++;
      user1Record.totalGames ++;
      user2Record.totalGames++;
      user1Record.save();
      user2Record.save();
    }

    if(user1Record != null && user2Record != null && session.win?.winnerID === session.user2ID){
      user2Record.totalWins ++;
      user1Record.totalGames ++;
      user2Record.totalGames++;
      user1Record.save();
      user2Record.save();
    }

    

    
    

    // update game
    gameSessions.saveSession(payload.gameID, session)

    // send game data
    socket.broadcast.to(session.gameID).emit("gamesession_updated", session)
    socket.emit("gamesession_updated", session)
  })

  /**
   * Exit Game
   * 
   * 
   */
  socket.on("request_exit_game", (gameID: string, callback: () => void) => {
    let session = gameSessions.findGame(gameID)

    if (!session)
      return logger.info("Error, game session not found")
    
    socket.broadcast.to(session.gameID).emit("response_exit_game", '')
    socket.emit("response_exit_game", '')
    
    gameSessions.removeSession(gameID)

    socket.leave(gameID)
  })
}