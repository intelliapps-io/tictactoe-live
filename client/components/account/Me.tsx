import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { config } from '../../helpers/config';
import { AuthContext } from './AuthContext';

export const MeComponent = () => {
  const { axios, authState, logout } = useContext(AuthContext);
  // Get account info


  if (authState.user)
    return (
      <View>
        <Card>
          <Card.Title style={styles.title}>
            {authState.user.firstName + ' ' + authState.user.lastName}
          </Card.Title>
          <Card.Divider />
          {/* <Text><MailOutlined /> {userData.email}</Text>
          <Text><PushpinOutlined /> {userData.totalGames} Total Games</Text> */}
          <View style={styles.infoRow}>
            <Icon name='email' color="#000" size={16} style={styles.icon} />
            <Text>{authState.user.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name='tooltip-account' color="#000" size={16} style={styles.icon} />
            <Text>{authState.user.totalGames} Total Games</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name='crown' color="#000" size={16} style={styles.icon} />
            <Text>{authState.user.totalWins} Wins</Text>
          </View>
          <Card.Divider style={{ marginVertical: 10 }} />
          <Button
              title="Logout"
              buttonStyle={{
                backgroundColor: 'rgba(111, 202, 186, 1)',
                borderRadius: 5,
              }}
              titleStyle={{ fontWeight: 'bold', fontSize: 23 }}
              containerStyle={{
                marginHorizontal: 50,
                height: 50,
                width: 200,
              }}
              onPress={logout}
            />
        </Card>
      </View>
    );
  else
    return <View><Text>Login</Text></View>
}

const styles = StyleSheet.create({
  title: {
    textTransform: 'capitalize'
  },
  infoRow: { display: 'flex', flexDirection: 'row', alignItems: 'center', alignContent: 'center' },
  icon: { marginRight: 10 }
})