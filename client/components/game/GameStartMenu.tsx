import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Input } from 'react-native-elements';
import { useNavigate } from 'react-router-native';
import { WSContext } from '../../helpers/context/WSContext';
import { IGameSession, IRequestJoinExistingGame } from '../../helpers/types';

interface IGameStartMenu {
  startJoinGame?: boolean
}

export function GameStartMenu(props: IGameStartMenu) {
  const [gameCode, setGameCode] = useState<string>('')
  const [gameCodeError, setGameCodeError] = useState<string>('');
  const { socket, setGameSession, setGameOpponent } = useContext(WSContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (props.startJoinGame)
      newGame()
  }, [props.startJoinGame])

  const newGame = () => {
    socket.emit("request_start_new_game", {}, (response: IGameSession) => {
      setGameSession(null)
      if (response.gameID) {
        setGameSession(response)
        setGameOpponent(null)
        navigate('/game')
      }
    });
  }

  const joinGame = () => {
    const payload: IRequestJoinExistingGame = { gameID: gameCode }
    console.log(payload)
    socket.emit("request_join_existing_game", payload, (response: IGameSession) => {
      if (response.gameID) {
        setGameSession(response)
        navigate('/game')
      }
    });
  }

  return (
    <Card>
      <Card.Title style={styles.title}>
        TikTacToe Live
      </Card.Title>
      <Card.Divider />
      <View style={styles.infoRow}>
        <Button
          title="New Game"
          buttonStyle={{
            backgroundColor: 'rgb(61, 191, 141)',
            borderRadius: 5,
          }}
          titleStyle={{ fontWeight: 'bold', fontSize: 23 }}
          containerStyle={{
            marginHorizontal: 50,
            height: 50,
            width: 200,
            marginVertical: 10,
          }}
          onPress={() => newGame()}
        />
      </View>
      <Card.Divider />
      <View style={styles.infoRow}>
        <View
          style={{ display: 'flex' }}
        >
          <Input
            placeholder='Enter 6-Digit Game Code'
            errorStyle={{ color: 'red' }}
            errorMessage={gameCodeError.length === 0 ? undefined : gameCodeError}
            value={gameCode}
            maxLength={6}
            onChangeText={val => {
              const reg = new RegExp('^[0-9]*$')
              if (reg.test(val) || val.length === 0)
                setGameCode(val)
            }}
            containerStyle={{ width: 300 }}
          />
          <Button
            title="Join Game"
            buttonStyle={{
              backgroundColor: '#3495e1',
              borderRadius: 5,
            }}
            titleStyle={{ fontWeight: 'bold', fontSize: 23 }}
            containerStyle={{
              marginHorizontal: 50,
              height: 50,
              width: 200,
              marginVertical: 10,
            }}
            onPress={() => joinGame()}
          />
        </View>
      </View>
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