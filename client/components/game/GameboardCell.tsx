import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-elements';

interface IGameboardCellProps {
  state: null | 'O' | 'X'
  onPress: () => void
  disabled?: boolean
  isWinCell: boolean
}

export function GameboardCell(props: IGameboardCellProps) {
  return (
    <Button
      title={
        <View style={styles.wrapper}>
          <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{props.state === null ? ' ' : props.state}</Text>
        </View>
      }
      buttonStyle={{
        backgroundColor: props.isWinCell ? 'red' : 'rgb(32, 137, 220)',
      }}
      containerStyle={styles.containerStyle}
      disabled={props.disabled && !props.isWinCell}
      onPress={props.isWinCell ? undefined : props.onPress}
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