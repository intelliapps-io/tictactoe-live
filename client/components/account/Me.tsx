import React, { useContext, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { AuthContext } from './AuthContext';

export const MeComponent = () => {
  const { axios, setAuthState } = useContext(AuthContext);

  axios.get('/account/me')
    .then(res => {
      console.log(res.data)
    })
    .catch(err => {
      console.log(err)
    })
  
  return (
    <>
    <Button>Me!</Button>
    </>
  )
}