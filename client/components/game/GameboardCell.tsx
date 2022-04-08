import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-elements';

interface IGameboardCellProps {
  state: null | 'O' | 'X'
  onPress: () => void
  disabled?: boolean
}

export function GameboardCell(props: IGameboardCellProps) {
  return (
    <Button
      title={
        <View style={styles.wrapper}>
          <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{props.state === null ? ' ' : props.state}</Text>
        </View>
      }
      containerStyle={styles.containerStyle}
      disabled={props.disabled}
      onPress={props.onPress}
    />
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    marginHorizontal: 10,
    marginVertical: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  wrapper: {
    height: 75,
    width: 75,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})