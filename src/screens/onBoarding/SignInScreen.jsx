import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';
import Toast from 'react-native-toast-message';

const SignInScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const signInFn = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    auth()
      .signInWithEmailAndPassword(email.trim(), password)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Logged in successfully!',
        });
        navigation.replace('HomeScreen');
      })
      .catch(error => {
        console.log(error);
        let message = 'Something went wrong.';

        if (error.code === 'auth/invalid-email') {
          message = 'Invalid email address.';
        } else if (error.code === 'auth/user-not-found') {
          message = 'No user found with this email.';
        } else if (error.code === 'auth/wrong-password') {
          message = 'Incorrect password.';
        }

        Toast.show({
          type: 'error',
          text1: 'Login Failed',
        });
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.skip}>Skip</Text>
      </View>

      <Text style={styles.title}>Sign In</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry={secureText}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <Icon
            name={secureText ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color="#aaa"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signInButton} onPress={signInFn}>
        <Text style={styles.signInText}>Sign in</Text>
      </TouchableOpacity>

      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="facebook" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <AntDesign name="google" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <AntDesign name="apple1" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>
        Don’t have an account?{' '}
        <Text
          style={styles.signUpText}
          onPress={() => {
            navigation.navigate('SignUpScreen');
          }}>
          Sign Up
        </Text>
      </Text>
    </SafeAreaView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 40,
  },
  skip: {
    color: '#fff',
    fontSize: 14,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    marginTop: 30,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  passwordContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    color: '#fff',
  },
  forgot: {
    color: '#aaa',
    textAlign: 'right',
    marginVertical: 10,
  },
  signInButton: {
    backgroundColor: '#EF4444',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  signInText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  orText: {
    color: '#999',
    marginHorizontal: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
  },
  signUpText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
