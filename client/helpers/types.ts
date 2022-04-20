export type IBoardCellState = 'X' | 'O' | null

export interface IWinResult {
  winCells: number[][];
  winSymbol: "X" | "O" | null;
  winnerID: string;
  isTie: boolean;
}

export interface IGameSession {
  gameID: string
  user1ID: string
  user2ID: string | null
  board: [
    [IBoardCellState, IBoardCellState, IBoardCellState],
    [IBoardCellState , IBoardCellState, IBoardCellState],
    [IBoardCellState , IBoardCellState, IBoardCellState]
  ]
  playerTurnID: string
  player1Symbol: 'X' | 'O'
  player2Symbol: 'X' | 'O'
  win: IWinResult | null
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
  symbol: 'X' | 'O'
  isTurn: boolean
}

export interface IRequestGameMove {
  gameID: string
  cellRow: number
  cellCol: number
}