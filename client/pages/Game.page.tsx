import { useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppHeader } from '../components/account/AppHeader';
import { Gameboard } from '../components/game/Gameboard';
import { WSContext } from '../helpers/context/WSContext';

export default function GamePage() {
  const { socket, gameSession } = useContext(WSContext)

  const exitGame = () => {
    if (gameSession)
      socket.emit('request_exit_game', gameSession.gameID)
  }

  return (
    <>
      <AppHeader onBack={exitGame} />
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
