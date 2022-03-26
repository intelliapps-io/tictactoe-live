import react, { createContext, useContext, useState } from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import { Button, ThemeProvider } from 'react-native-elements';
import { NativeRouter } from 'react-router-native';
import { AuthContext, AuthProvider } from './components/account/AuthContext';
import LoginForm from './components/account/LoginForm';
import { MeComponent } from './components/account/Me';

export default function App() {
  // var ws = new WebSocket('ws://192.168.1.201:8080')
  // ws.onerror = (err) => console.log(err)
  // ws.onopen = () => {
  //   // connection opened
  //   console.log('connected');
  //   ws.send('something');  // send a message
  // };

  const authContext = useContext(AuthContext);
  const [status, setStatus] = useState('loading');

  const theme = ({
    Button: {
      titleStyle: {
        // color: 'red',
      },
    },
  });

  return (
    <NativeRouter>
      <ThemeProvider theme={theme}>
        <AuthProvider >
          <LoginForm />
          <MeComponent />
        </AuthProvider>
        
      </ThemeProvider>
    </NativeRouter>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF',
  },
});


