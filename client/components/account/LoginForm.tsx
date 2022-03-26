import React, { useContext, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, ButtonGroup, withTheme, Text, Input } from 'react-native-elements';
import { AuthContext } from './AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState<string>('jared.moore@intelliapps.io');
  const [password, setPassword] = useState<string>('intelliapps');
  const { axios, setAuthState } = useContext(AuthContext);

  const handleLogin = () => {
    axios.post('/account/login', { email, password }, {})
      .then(res => {
        setAuthState({
          accessToken: res.data.tokens.accessToken,
          refreshToken: res.data.tokens.refreshToken,
          authenticated: true
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <>
      <ScrollView>
        <View style={styles.contentView}>
          <Text style={styles.subHeader}>Login</Text>
          <View style={styles.buttonsContainer}>
            <Input value={email} onChangeText={val => setEmail(val)} placeholder='Email' />
            <Input placeholder="Password" secureTextEntry={true} value={password} onChangeText={val => setPassword(val)} />
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