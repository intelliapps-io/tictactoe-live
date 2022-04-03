import react, { useContext, useState } from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import { AuthContext } from '../components/account/AuthContext';
import LoginForm from '../components/account/LoginForm';
import { MeComponent } from '../components/account/Me';



export default function HomePage() {
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

  const loggedIn = (authContext && authContext.authState && authContext.authState.user) ? true : false

  // authContext.authState.authenticated

  return (
    <>
      <MeComponent />
    </>
  );
}



