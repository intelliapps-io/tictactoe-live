import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Header, Text } from 'react-native-elements';
import { Link } from 'react-router-native';

export function AppHeader() {
  const Back = () => (
    <Link to="/">
      <Text>Back</Text>
    </Link>
  )

  return (
    <Header
      leftComponent={<Back />}
    >

    </Header>
  )
}