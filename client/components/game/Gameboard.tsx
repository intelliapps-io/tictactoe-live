import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Input, Text } from 'react-native-elements';
import { Link } from 'react-router-native';
import { AuthContext } from '../../helpers/context/AuthContext';
import { WSContext } from '../../helpers/context/WSContext';
import { IUser } from '../../helpers/types';

export function Gameboard() {
  const { socket, gameSession, gameOpponent } = useContext(WSContext)
  const { authState } = useContext(AuthContext)

  if (!gameSession)
    return <Text>Error joining game</Text>

  // socket listener
  useEffect(() => {
    // socket.on('response_set_opponent', (opponent) => {
    //   console.log(opponent)
    // })
    // return function cleanup() {
    //   socket.off('response_set_opponent')
    // }
  }, [])

  // useEffect(() => {
  //   if (!authState.user)
  //     return

  //   if (authState.user._id === gameSession.user1ID)
  //     setOpponentID(gameSession.user2ID)
  //   else if (authState.user._id === gameSession.user2ID)
  //     setOpponentID(gameSession.user1ID)
  // }, [gameSession])

  if (!gameOpponent)
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
      <Text style={styles.subTitle}>Opponent: {gameOpponent.firstName} + {gameOpponent.lastName}</Text>
      <Card.Divider style={styles.divider} />
      
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
  icon: { marginRight: 10 },
  container: { flex: 1 }
})