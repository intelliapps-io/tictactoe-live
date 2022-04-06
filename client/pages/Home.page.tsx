import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { MeComponent } from '../components/account/Me';
import { GameStartMenu } from '../components/game/GameStartMenu';
import { AuthContext } from '../helpers/context/AuthContext';

export default function HomePage() {
  const authContext = useContext(AuthContext);

  const loggedIn = (authContext && authContext.authState && authContext.authState.user) ? true : false

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
