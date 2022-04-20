import React from 'react';
import { Header, Text } from 'react-native-elements';
import { Link } from 'react-router-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { StyleSheet, View } from 'react-native';

interface IProps {
  onBack?: () => void
}

export function AppHeader(props: IProps) {
  const Back = () => (
    <Link to="/" onPress={props.onBack}>
      <View style={styles.back}>
        <Icon name='leftcircleo' color="#000" size={22} />
        <Text style={styles.backText}>Back</Text>
      </View>
    </Link>
  )

  return (
    <Header leftComponent={<Back />}>
    </Header>
  )
}

const styles = StyleSheet.create({
  back: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 10
  }
})