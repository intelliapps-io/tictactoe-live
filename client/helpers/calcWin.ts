import { IGameSession } from "./types"

export interface IWinResult {
  winCells: number[][]
  winSymbol: "X" | "O"
  winnerID: string
  isTie: boolean
}

export function calcWin(session: IGameSession): IWinResult | null {
  const { board } = session

  let result: IWinResult = {
    winCells: [],
    winSymbol: "X",
    winnerID: "",
    isTie: false
  }

  // same cell wins
  const wins: number[][][] = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[2, 0], [1, 1], [0, 2]],
  ]

  // find win
  for (let i = 0; i < wins.length; i++) {
    const win = wins[i],
      cell1 = board[win[0][0]][win[0][1]],
      cell2 = board[win[1][0]][win[1][1]],
      cell3 = board[win[2][0]][win[2][1]]
    if (cell1 === cell2 && cell2 === cell3 && cell1 !== null) {
      result.winCells = win
      result.winSymbol = cell1
      break
    }
  }

  // set winner
  if (result.winSymbol === session.player1Symbol)
    result.winnerID = session.user1ID
  else
    result.winnerID = session.user2ID!

  return result.winCells.length === 0 ? null : result
}