import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import React, {useContext} from 'react';
import {COLOR} from '../utils/constant';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ThemeContext} from '../services/ThemeContext';

const ProfileScreen = ({navigation}) => {
  const user = auth().currentUser;
  const email = user?.email;
  const displayName = user?.displayName || 'User';
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          auth()
            .signOut()
            .then(() => {
              navigation.reset({
                index: 0,
                routes: [{name: 'SignInScreen'}],
              });
            });
        },
      },
    ]);
  };

  const profileOptions = [
    {
      id: 1,
      title: 'My Watchlist',
      subtitle: 'Movies and shows to watch',
      icon: 'bookmark-outline',
      onPress: () => navigation.navigate('WatchlistScreen'),
    },
    {
      id: 2,
      title: 'My Favorites',
      subtitle: 'Your favorite content',
      icon: 'heart-outline',
      onPress: () => navigation.navigate('FavoritesScreen'),
    },
    {
      id: 3,
      title: 'Watch History',
      subtitle: 'Recently watched content',
      icon: 'history',
      onPress: () => navigation.navigate('HistoryScreen'),
    },
    {
      id: 4,
      title: 'My Reviews',
      subtitle: "Reviews you've written",
      icon: 'star-outline',
      onPress: () => navigation.navigate('ReviewsScreen'),
    },
    {
      id: 5,
      title: 'Settings',
      subtitle: 'App preferences',
      icon: 'cog-outline',
      onPress: () => navigation.navigate('SettingsScreen'),
    },
    {
      id: 6,
      title: 'Help & Support',
      subtitle: 'Get help and support',
      icon: 'help-circle-outline',
      onPress: () => navigation.navigate('SupportScreen'),
    },
  ];

  const renderProfileOption = option => (
    <TouchableOpacity
      key={option.id}
      style={styles.optionItem}
      onPress={option.onPress}
      activeOpacity={0.7}>
      <View style={styles.optionLeft}>
        <View style={styles.iconContainer}>
          <Icon name={option.icon} size={24} color="#EF4444" />
        </View>
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>{option.title}</Text>
          <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
        </View>
      </View>
      <Icon name="chevron-right" size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#121212"
        translucent={false}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon
              name="arrow-left"
              size={24}
              color={theme === 'dark' ? '#FFFFFF' : '#000000'}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Icon
                name="account"
                size={50}
                color={theme === 'dark' ? '#FFFFFF' : '#000000'}
              />
            </View>
          </View>

          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>

          <TouchableOpacity style={styles.editProfileButton}>
            <Icon name="pencil-outline" size={16} color="#EF4444" />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Watched</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Watchlist</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        <View style={styles.optionsSection}>
          {profileOptions.map(renderProfileOption)}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}>
          <Icon name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
      fontSize: 20,
      fontWeight: 'bold',
    },
    placeholder: {
      width: 40,
    },
    profileSection: {
      alignItems: 'center',
      paddingVertical: 32,
      paddingHorizontal: 16,
    },
    avatarContainer: {
      marginBottom: 16,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme === 'dark' ? '#1E1E1E' : '#EEEEEE',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: '#EF4444',
    },
    displayName: {
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    email: {
      color: theme === 'dark' ? '#AAAAAA' : '#666666',
      fontSize: 16,
      marginBottom: 20,
    },
    editProfileButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#1E1E1E' : '#F5F5F5',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#EF4444',
    },
    editProfileText: {
      color: '#EF4444',
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 8,
    },
    statsSection: {
      flexDirection: 'row',
      backgroundColor: theme === 'dark' ? '#1E1E1E' : '#F0F0F0',
      marginHorizontal: 16,
      borderRadius: 12,
      paddingVertical: 20,
      marginBottom: 24,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statNumber: {
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    statLabel: {
      color: theme === 'dark' ? '#AAAAAA' : '#666666',
      fontSize: 14,
    },
    statDivider: {
      width: 1,
      backgroundColor: theme === 'dark' ? '#333' : '#CCCCCC',
      marginVertical: 8,
    },
    optionsSection: {
      marginHorizontal: 16,
      backgroundColor: theme === 'dark' ? '#1E1E1E' : '#F9F9F9',
      borderRadius: 12,
      marginBottom: 24,
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#333' : '#DDD',
    },
    optionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme === 'dark' ? '#2A2A2A' : '#EAEAEA',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    optionText: {
      flex: 1,
    },
    optionTitle: {
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 2,
    },
    optionSubtitle: {
      color: theme === 'dark' ? '#888888' : '#666666',
      fontSize: 14,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#EF4444',
      marginHorizontal: 16,
      paddingVertical: 16,
      borderRadius: 12,
      marginBottom: 20,
    },
    logoutText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    bottomSpacing: {
      height: 20,
    },
  });
