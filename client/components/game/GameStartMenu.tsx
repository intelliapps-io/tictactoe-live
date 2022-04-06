import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Input, Text } from 'react-native-elements';
import { Link } from 'react-router-native';
import { AuthContext, IAuthState } from '../../helpers/context/AuthContext';
import { ISocket, WSContext } from '../../helpers/context/WSContext';

export function GameStartMenu() {
  const [gameCode, setGameCode] = useState<string>('')
  const [gameCodeError, setGameCodeError] = useState<string>('');
  const { socket } = useContext(WSContext)
  const { authState } = useContext(AuthContext)

  const newGame = () => {
    interface IReqNewGameData {
      userID: string
    }
    interface IResNewGameData {
      gameID: string
    }
    const message: IReqNewGameData = {
      userID: authState.user!._id
    }
  
    socket.emit("request_start_new_game", message);
  }

  socket.on("response_start_new_game", (res) => {
    console.log(res)
  });

  return (
    <Card>
      <Card.Title style={styles.title}>
        TikTakToe Live
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
            onPress={() => { }}
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