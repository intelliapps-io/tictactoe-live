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


  return (
    <View>
      <Text>{isWinner ? 'You Won!' : 'You are a looser!'}</Text>
      <Text>{ props.gameSession.win.isTie ? 'TIE' : ''}</Text>
      
    </View>
  )
}

const styles = StyleSheet.create({ 

})