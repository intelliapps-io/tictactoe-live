import { ScrollView, StyleSheet, View } from 'react-native';
import { MeComponent } from '../components/account/Me';
import { GameStartMenu } from '../components/game/GameStartMenu';

export default function HomePage() {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <GameStartMenu />
        <MeComponent />
      </View>
    </ScrollView>
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
