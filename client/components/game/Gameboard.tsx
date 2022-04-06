import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Input, Text } from 'react-native-elements';
import { Link } from 'react-router-native';
import { AuthContext } from '../../helpers/context/AuthContext';
import { WSContext } from '../../helpers/context/WSContext';

export function Gameboard() {
  const [gameCode, setGameCode] = useState<string>('')
  const [gameCodeError, setGameCodeError] = useState<string>('');
  const { socket } = useContext(WSContext)
  const { authState } = useContext(AuthContext)

  const startGame = () => {

  }

  return (
    <Card>
      <Text>Gameboard</Text>
    </Card >
  )
}

const styles = StyleSheet.create({
  title: {
    textTransform: 'capitalize',
    fontSize: 22
  },
  infoRow: { display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center' },
  icon: { marginRight: 10 },
  container: { flex: 1 }
})