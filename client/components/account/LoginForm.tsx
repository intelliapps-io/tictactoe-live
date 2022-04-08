import React, { useContext, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, ButtonGroup, withTheme, Text, Input } from 'react-native-elements';
import { useNavigate } from 'react-router-native';
import { config } from '../../helpers/config';
import { AuthContext } from '../../helpers/context/AuthContext';
import { AppHeader } from './AppHeader';

export default function LoginForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errMessage, setErrMessage] = useState<string | null>('')
  const { axios, setAuthState } = useContext(AuthContext);
  const nav = useNavigate()

  const handleLogin = (_email?: string, _password?: string) => {
    axios.post('/account/login', { email: _email ? _email : email, password: _password ? _password : password}, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': config.BASE_SERVER_URL,
      }
    })
      .then(res => {
        setAuthState({
          accessToken: res.data.tokens.accessToken,
          refreshToken: res.data.tokens.refreshToken,
          user: res.data.user
        })
        nav('/')
      })
      .catch(err => {
        console.log(err)
        setErrMessage(err.message)
      })
  }

  return (
    <>
      <AppHeader />
      <ScrollView>
        <View style={styles.contentView}>
          <Text style={styles.subHeader}>Login</Text>
          <View style={styles.buttonsContainer}>
            <Button
              title="Bob"
              titleStyle={{ fontSize: 16 }}
              containerStyle={{ marginRight: 20 }}
              onPress={() => {
                setEmail('bob@bob.bob')
                setPassword('bob')
                handleLogin('bob@bob.bob', 'bob')
              }}
            />
            <Button
              title="Jill"
              titleStyle={{ fontSize: 16 }}
              onPress={() => {
                setEmail('jill@jill.jill')
                setPassword('jill')
                handleLogin('jill@jill.jill', 'jill')
              }}
            />

            <Input value={email} onChangeText={val => setEmail(val)} placeholder='Email' />
            <Input placeholder="Password" secureTextEntry={true} value={password} onChangeText={val => setPassword(val)} />
            <Text style={{ color: 'red', flexDirection: 'row' }}>{errMessage}</Text>
            <Button
              title="Log in"
              loading={false}
              loadingProps={{ size: 'small', color: 'white' }}
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
              onPress={() => handleLogin()}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
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