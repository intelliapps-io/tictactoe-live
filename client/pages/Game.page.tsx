import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppHeader } from '../components/account/AppHeader';
import { MeComponent } from '../components/account/Me';
import { Gameboard } from '../components/game/Gameboard';
import { GameStartMenu } from '../components/game/GameStartMenu';
import { AuthContext } from '../helpers/context/AuthContext';
import { WSContext } from '../helpers/context/WSContext';

export default function GamePage() {
  const authContext = useContext(AuthContext);
  const { socket } = useContext(WSContext)

  const loggedIn = (authContext && authContext.authState && authContext.authState.user) ? true : false

  const exitGame = () => {
    socket.emit('request_exit_game')
  }

  return (
    <>
      <AppHeader onBack={exitGame}/>
      <ScrollView contentContainerStyle={styles.scrollView}>

        <View style={styles.container}>
          <Gameboard />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
});
