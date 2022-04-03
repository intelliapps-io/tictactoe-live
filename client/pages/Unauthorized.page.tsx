import react, { useContext, useState } from 'react';
import { ScrollView, ScrollViewBase, StyleSheet, View, } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { Link } from 'react-router-native';
import { AuthContext } from '../components/account/AuthContext';
import LoginForm from '../components/account/LoginForm';
import { MeComponent } from '../components/account/Me';

export default function UnauthorizedPage() {
  const authContext = useContext(AuthContext);
  const [status, setStatus] = useState('loading');

  const theme = ({
    Button: {
      titleStyle: {
        // color: 'red',
      },
    },
  });

  const loggedIn = (authContext && authContext.authState && authContext.authState.user) ? true : false

  // authContext.authState.authenticated

  return (
    <View style={styles.contentView}>
      <Text h1 style={{ marginBottom: 40 }}>TikTakToe Live</Text>
      <Link to="/login">
        {/* <Button
            title="Login"
            buttonStyle={{

            }}
            titleStyle={{ fontWeight: 'bold', fontSize: 23 }}
            containerStyle={{

            }}
          /> */}
        
        <Text style={{
          backgroundColor: 'rgba(111, 202, 186, 1)',
          borderRadius: 5,
          marginHorizontal: 50,
          height: 50,
          width: 200,
          color: '#fff',
          marginVertical: 10,
          textAlignVertical: 'center',
          textAlign: 'center',
          fontSize: 20
        }}>Login</Text>
      </Link>
      <Text style={{ fontSize: 20 }}>Or</Text>
      <Link to="/signup">
        <Text style={{
          backgroundColor: '#09f',
          color: '#fff',
          borderRadius: 5,
          marginHorizontal: 50,
          height: 50,
          width: 200,
          marginVertical: 10,
          textAlignVertical: 'center',
          textAlign: 'center',
          fontSize: 20
        }}>Signup</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  contentView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  subHeader: {
    backgroundColor: "#2089dc",
    color: "white",
    textAlign: "center",
    paddingVertical: 5,
    marginBottom: 10
  }
})

