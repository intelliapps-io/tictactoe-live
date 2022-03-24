import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, } from 'react-native';
var ws = new WebSocket('ws://host.com/path');

export default function App() {
  var ws = new WebSocket('ws://192.168.1.201:8080')
  
  ws.onerror = (err) => console.log(err)

  console.log('start');

  ws.onopen = () => {
    // connection opened
    console.log('connected');

    ws.send('something');  // send a message
  };

  return (
    <View style={styles.container}>
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <Text>Hello world</Text>
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF',
  },
});
