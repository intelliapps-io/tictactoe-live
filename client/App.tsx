import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,  } from 'react-native';

export default function App() {
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
