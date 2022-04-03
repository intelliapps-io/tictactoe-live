import React, { useContext, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, ButtonGroup, withTheme, Text, Input } from 'react-native-elements';
import { useNavigate } from 'react-router-native';
import { config } from '../../helpers/config';
import { AppHeader } from './AppHeader';
import { AuthContext } from './AuthContext';

export default function SignupForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [errMessage, setErrMessage] = useState<string | null>('')
  const { axios, setAuthState } = useContext(AuthContext);
  const nav = useNavigate()

  const handleLogin = () => {
    axios.put('/account/signup', { email, password, firstName, lastName }, {
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
      <ScrollView>
      <AppHeader />
        <View style={styles.contentView}>
          <Text style={styles.subHeader}>Signup</Text>
          <View style={styles.buttonsContainer}>
            <Input value={email} onChangeText={val => setEmail(val)} placeholder='Email' />
            <Input value={firstName} onChangeText={val => setFirstName(val)} placeholder='First Name' />
            <Input value={lastName} onChangeText={val => setLastName(val)} placeholder='Last Name' />
            <Input placeholder="Password" secureTextEntry={true} value={password} onChangeText={val => setPassword(val)} />
            <Text style={{ color: 'red', flexDirection: 'row' }}>{errMessage}</Text>
            <Button
              title="Sign Up"
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
              onPress={handleLogin}
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