export interface IGameSession {
  gameID: string
  user1ID: string
  user2ID: string | null
}

export interface IRequestJoinExistingGame {
  gameID: string
}

export interface IUser {
  _id: string
  email: string
  firstName: string
  lastName: string
  totalGames: number
  totalWins: number
}

export interface IPlayerInfo {
  isSymbolX: boolean
  isTurn: boolean
}