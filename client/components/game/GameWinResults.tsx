import { useContext } from "react";
import { StyleSheet, View} from "react-native";
import { Text } from "react-native-elements"
import { AuthContext } from "../../helpers/context/AuthContext";
import { IGameSession, IUser } from "../../helpers/types";

interface IGameWinResults {
  opponent: IUser
  gameSession: IGameSession
}

export function GameWinResults(props: IGameWinResults) {
  const { authState } = useContext(AuthContext)
  
  if (!authState.user || !authState.user || !props.gameSession.win)
    return (<Text>No Win</Text>)
    
  const isWinner = authState.user._id === props.gameSession.win.winnerID
  const winMessage = props.gameSession.win.isTie ? 'TIE' : isWinner ? 'You Won!' : 'You Lost!'

  return (
    <View>
      <Text style={styles.winMessage}>{winMessage}</Text>
    </View>
  )
}

const styles = StyleSheet.create({ 
  winMessage: {
    fontSize: 30,
    textAlign: 'center'
  }
})