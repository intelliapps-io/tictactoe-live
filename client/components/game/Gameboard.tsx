import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Input, Text } from 'react-native-elements';
import { Link } from 'react-router-native';
import { AuthContext } from '../../helpers/context/AuthContext';
import { WSContext } from '../../helpers/context/WSContext';
import { IBoardCellState, IPlayerInfo, IRequestGameMove, IUser } from '../../helpers/types';
import { GameboardCell } from './GameboardCell';

export function Gameboard() {
  const { socket, gameSession, gameOpponent } = useContext(WSContext)
  const { authState } = useContext(AuthContext)

  if (!gameSession || !authState.user)
    return <Text>Error joining game</Text>

  const playerInfo: IPlayerInfo = {
    symbol: authState.user._id === gameSession.user1ID ? gameSession.player1Symbol : gameSession.player2Symbol,
    isTurn: authState.user._id === gameSession.playerTurnID
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

  return (
    <Card>
      <Text style={styles.title} >Game Code: {gameSession.gameID}</Text>
      <View></View>
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
      <Card.Divider style={styles.divider} />
      {gameSession.board.map((row, i) =>
        <View style={styles.boardRow}>
          {row.map((cell, j) =>
            <GameboardCell
              state={cell}
              onPress={() => handleCellPress(i, j)}
              disabled={!playerInfo.isTurn}
            />
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
  boardRow: {  display: 'flex', flexDirection: 'row', alignItems: 'center', alignContent: 'center' },
  icon: { marginRight: 10 },
  container: { flex: 1 }
})