import react, { useContext, useState } from 'react';
import { ScrollView, ScrollViewBase, StyleSheet, View, } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { Link, Navigate, useNavigate } from 'react-router-native';
import LoginForm from '../components/account/LoginForm';
import { MeComponent } from '../components/account/Me';
import { AuthContext } from '../helpers/context/AuthContext';

export default function UnauthorizedPage() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate()

  const loggedIn = (authContext && authContext.authState && authContext.authState.user) ? true : false

  if (loggedIn)
    return <Navigate to="/"/>    

  return (
    <View style={styles.contentView}>
      <Text h1 style={{ marginBottom: 40 }}>TicTacToe Live</Text>
      <Button
        title="Login"
        buttonStyle={{
          backgroundColor: 'rgba(111, 202, 186, 1)',
          borderRadius: 5,
        }}
        titleStyle={{ fontWeight: 'bold', fontSize: 23 }}
        containerStyle={{
          marginHorizontal: 50,
          height: 50,
          width: 200,
          marginVertical: 10,
        }}
        onPress={() => navigate('/login')}
      />
      <Text style={{ fontSize: 20 }}>Or</Text>
      <Button
        title="Signup"
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
        onPress={() => navigate('/signup')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  subHeader: {
    backgroundColor: "#2089dc",
    color: "white",
    textAlign: "center",
    paddingVertical: 5,
    marginBottom: 10
  }
})

