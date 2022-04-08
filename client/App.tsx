import { useContext } from 'react';
import { ThemeProvider } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NativeRouter, Route, Routes, useNavigate, useLocation, Navigate } from 'react-router-native';
import LoginForm from './components/account/LoginForm';
import SignupForm from './components/account/SignupForm';
import { AuthContext, AuthProvider } from './helpers/context/AuthContext';
import { WSProvider } from './helpers/context/WSContext';
import GamePage from './pages/Game.page';
import HomePage from './pages/Home.page';
import UnauthorizedPage from './pages/Unauthorized.page';

function _App() {
  const { authState } = useContext(AuthContext)
  const naviage = useNavigate()
  const location = useLocation()

  const loggedIn = (authState && authState.user) ? true : false

  if (location.pathname === "/" && !loggedIn)
    return <Navigate to="/unauthorized" />

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/game" element={<GamePage /> } />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
    </Routes>
  );
}

// wapper
export default function App() {

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
        <AuthProvider>
          <WSProvider>
            <ThemeProvider theme={theme}>
              <_App />
            </ThemeProvider>
          </WSProvider>
        </AuthProvider>
      </NativeRouter>
    </SafeAreaProvider>
  )
}
