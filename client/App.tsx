import react, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import { Button, ThemeProvider } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NativeRouter, Route, Routes, useNavigate, useLocation, Navigate } from 'react-router-native';
import { AuthContext, AuthProvider } from './components/account/AuthContext';
import LoginForm from './components/account/LoginForm';
import { MeComponent } from './components/account/Me';
import SignupForm from './components/account/SignupForm';
import HomePage from './pages/Home.page';
import UnauthorizedPage from './pages/Unauthorized.page';

function _App() {
  const { authState } = useContext(AuthContext)
  const naviage = useNavigate()
  const location = useLocation()

  const loggedIn = (authState && authState.user) ? true : false

  if (location.pathname === "/" && !loggedIn) {
    return <Navigate to="/unauthorized" />
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
    </Routes>
  );
}

// wapper
export default function App() {
  // var ws = new WebSocket('ws://192.168.1.201:8080')
  // ws.onerror = (err) => console.log(err)
  // ws.onopen = () => {
  //   // connection opened
  //   console.log('connected');
  //   ws.send('something');  // send a message
  // };

  const theme = ({
    Button: {
      titleStyle: {
        // color: 'red',
      },
    },
  });

  return (
    <SafeAreaProvider>
      <NativeRouter>
        <AuthProvider >
          <ThemeProvider theme={theme}>
            <_App />
          </ThemeProvider>
        </AuthProvider>
      </NativeRouter>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF',
  },
});
