import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Input, Text } from 'react-native-elements';
import { Link } from 'react-router-native';
import { AuthContext } from '../../helpers/context/AuthContext';
import { WSContext } from '../../helpers/context/WSContext';
import { IBoardCellState, IPlayerInfo, IRequestGameMove, IUser, IWinResult } from '../../helpers/types';
import { GameboardCell } from './GameboardCell';
import { GameWinResults } from './GameWinResults';

export function Gameboard() {
  const { socket, gameSession, gameOpponent } = useContext(WSContext)
  const { authState } = useContext(AuthContext)

  if (!gameSession || !authState.user)
    return <Text>Error joining game</Text>
  
  const isWinner = gameSession.win && authState.user._id === gameSession.win.winnerID ? true : false

  const playerInfo: IPlayerInfo = {
    symbol: authState.user._id === gameSession.user1ID ? gameSession.player1Symbol : gameSession.player2Symbol,
    isTurn: authState.user._id === gameSession.playerTurnID
  }

  const calcIsWinCell = (i: number, j: number, winCells: IWinResult['winCells'] | null) => {
    if (!winCells)
      return false

    for (let cell = 0; cell < winCells.length; cell++)
      if (i === winCells[cell][0] && j === winCells[cell][1])
        return true

    return false
  }

  const handleCellPress = (i: number, j: number) => {
    if (!gameOpponent)
      return console.log(new Error('No game opponent or player info'))

    if (playerInfo.isTurn) {
      const payload: IRequestGameMove = {
        cellRow: i,
        cellCol: j,
        gameID: gameSession.gameID
      }
      socket.emit('request_game_move', payload)
    }
  }

  if (!gameOpponent || !playerInfo)
    return (
      <Card>
        <Text style={styles.title} >Game Code: {gameSession.gameID}</Text>
        <View></View>
        <Text style={{ fontSize: 18 }}>Waiting for opponent, share your game code</Text>
      </Card>
    )
  
  if (gameOpponent && gameSession.win)
    <GameWinResults gameSession={gameSession} opponent={gameOpponent}/>

  return (
    <Card>
      {!gameSession.win && <Text style={styles.title} >Game Code: {gameSession.gameID}</Text>}
      
      {/* Game Info */}
      <View style={{ display: gameSession.win ? 'none' : undefined }}>
        <Text style={styles.subTitle}>Opponent: {gameOpponent.firstName} {gameOpponent.lastName}</Text>
        <Text style={styles.subTitle}>Symbol: {playerInfo.symbol}</Text>
        <Text
          style={{
            fontWeight: playerInfo.isTurn ? 'bold' : 'normal',
            fontStyle: playerInfo.isTurn ? 'normal' : 'italic',
            fontSize: 16,
          }}>
          {playerInfo.isTurn ? 'Your move' : "Opponent's move"}
        </Text>
      </View>

      {gameSession.win ? <GameWinResults
        gameSession={gameSession}
        opponent={gameOpponent}
      /> : undefined}

      <Card.Divider style={styles.divider} />

      {/* Board Cell Grid */}
      {gameSession.board.map((row, i) =>
        <View style={styles.boardRow}>
          {row.map((cell, j) => {
            const isWinCell = calcIsWinCell(i, j, gameSession.win ? gameSession.win.winCells : null)
            return (
              <GameboardCell
                state={cell}
                onPress={() => handleCellPress(i, j)}
                disabled={!playerInfo.isTurn || gameSession.win ? true : false}
                isWinCell={isWinCell}
                isWinner={isWinner}
              />
            )
          }
          )}
        </View>
      )}
    </Card >
  )
}

const styles = StyleSheet.create({
  title: {
    textTransform: 'capitalize',
    fontSize: 22,
  },
  subTitle: {
    textTransform: 'capitalize',
    fontSize: 16,
  },
  divider: { marginTop: 10, marginBottom: 10 },
  infoRow: { display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center' },
  boardRow: { display: 'flex', flexDirection: 'row', alignItems: 'center', alignContent: 'center' },
  icon: { marginRight: 10 },
  container: { flex: 1 }
})