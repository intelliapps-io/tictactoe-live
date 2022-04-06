import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Header, Text } from 'react-native-elements';
import { Link } from 'react-router-native';

interface IProps {
  onBack?: () => void
}

export function AppHeader(props: IProps) {
  const Back = () => (
    <Link to="/" onPress={props.onBack}>
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