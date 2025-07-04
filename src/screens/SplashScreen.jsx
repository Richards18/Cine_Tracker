import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {COLOR} from '../utils/constant';
import auth from '@react-native-firebase/auth';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      const unsubscribe = auth().onAuthStateChanged(user => {
        if (user) {
          navigation.replace('HomeScreen');
        } else {
          navigation.replace('SignInScreen');
        }
      });

      return () => {
        clearTimeout(timeout);
        unsubscribe();
      };
    }, 1500);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centered}>
        <Image
          source={require('../assets/Splash_Icon.png')}
          style={{height: '10%', width: '90%'}}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.PRIMARY,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
