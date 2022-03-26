//AuthContext.js
import axios, { Axios } from 'axios';
import React, { createContext, useContext, useState } from 'react';
import * as Keychain from 'react-native-keychain';
import { config } from '../../helpers/config';

export interface IAuthState {
  accessToken: string | null,
  refreshToken: string | null,
  authenticated: boolean,
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
    authenticated: false,
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
    await Keychain.resetGenericPassword();
    setAuthState({
      accessToken: null,
      refreshToken: null,
      authenticated: false,
    });
    return true
  };

  const getAccessToken = (): string | null => {
    return authState.accessToken;
  };

  return (
    <AuthContext.Provider
      value={{ authState, getAccessToken, setAuthState, logout, axios: axiosItem }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };