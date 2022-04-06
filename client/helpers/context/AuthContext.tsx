//AuthContext.js
import axios, { Axios } from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Keychain from 'react-native-keychain';
import { useNavigate } from 'react-router-native';
import { config } from '../../helpers/config';

export interface IAuthState {
  accessToken: string | null,
  refreshToken: string | null,
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    totalGames: number;
    totalWins: number;
  } | null
}

export interface IAuthContext {
  authState: IAuthState
  getAccessToken: () => string | null
  setAuthState: (state: IAuthState) => void
  logout: () => void
  axios: Axios
}

const AuthContext = createContext<IAuthContext>(null as any);

const AuthProvider = ({ children }: { children: any }) => {
  const [authState, setAuthState] = useState<IAuthState>({
    accessToken: null,
    refreshToken: null,
    user: null,
  });

  const axiosItem = axios.create({
    baseURL: config.BASE_SERVER_URL,
  });

  axiosItem.interceptors.request.use(
    config => {
      //@ts-ignore
      if (!config.headers.Authorization) {
        //@ts-ignore
        config.headers.Authorization = `Bearer ${getAccessToken()}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  const logout = async (): Promise<boolean> => {
    // await Keychain.resetGenericPassword();
    await axios.post(config.BASE_SERVER_URL + '/account/logout', {}, { withCredentials: true })
    setTimeout(() => {
      setAuthState({
        accessToken: null,
        refreshToken: null,
        user: null,
      });
    }, 200)
    return true
  };

  const getAccessToken = (): string | null => {
    return authState.accessToken;
  };

  useEffect(() => {
    axios.get(config.BASE_SERVER_URL + '/account/me', {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': config.BASE_SERVER_URL,
      }
    }).then(res => {    
      setAuthState({
        ...authState,
        user: res.data,
      });
    }).catch(err => {
      console.log(err)
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{ authState, getAccessToken, setAuthState, logout, axios: axiosItem }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };