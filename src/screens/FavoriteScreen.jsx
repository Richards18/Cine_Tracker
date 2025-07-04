import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, {useContext} from 'react';
import {FavoritesContext} from '../services/FavoriteContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ThemeContext} from '../services/ThemeContext';

const FavoriteScreen = ({navigation}) => {
  const {favorites, toggleFavorite} = useContext(FavoritesContext);
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);

  const favoritePairs = [];
  for (let i = 0; i < favorites.length; i += 2) {
    favoritePairs.push(favorites.slice(i, i + 2));
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#121212"
        translucent={false}
      />
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
        <Text style={styles.headerTitle}>Favorites</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {favorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No favorites added yet.</Text>
          </View>
        ) : (
          favoritePairs.map((pair, index) => (
            <View key={index} style={styles.row}>
              {pair.map(item => (
                <View key={item.id} style={styles.card}>
                  <TouchableOpacity
                    onPress={() => toggleFavorite(item)}
                    style={styles.removeIcon}>
                    <Icon name="heart-off-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('DetailScreen', {movie: item})
                    }>
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                      }}
                      style={styles.poster}
                      resizeMode="cover"
                    />
                    <View style={styles.info}>
                      <Text style={styles.title} numberOfLines={2}>
                        {item.title || item.name}
                      </Text>
                      <Text style={styles.year}>
                        🎬{' '}
                        {item.release_date?.slice(0, 4) ||
                          item.first_air_date?.slice(0, 4)}
                      </Text>
                      <Text style={styles.rating}>
                        ⭐ {item.vote_average?.toFixed(1)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default FavoriteScreen;

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 50,
    },
    emptyText: {
      fontSize: 18,
      color: theme === 'dark' ? '#888' : '#555',
      fontStyle: 'italic',
    },
    heading: {
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      flex: 1,
      marginBottom: 20,
      marginTop: 10,
    },
    scrollContainer: {
      paddingHorizontal: 16,
      paddingBottom: 80,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    card: {
      width: '48%',
      backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f2f2f2',
      borderRadius: 10,
      overflow: 'hidden',
      elevation: 2,
    },
    poster: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
    },
    info: {
      padding: 10,
    },
    title: {
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    year: {
      color: theme === 'dark' ? '#AAAAAA' : '#555555',
      fontSize: 13,
      marginBottom: 2,
    },
    rating: {
      color: '#EF4444',
      fontWeight: 'bold',
      fontSize: 14,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    placeholder: {
      width: 40,
    },
    headerTitle: {
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
      fontSize: 20,
      fontWeight: 'bold',
    },
    backButton: {
      padding: 8,
    },
    removeIcon: {
      position: 'absolute',
      top: 8,
      right: 8,
      zIndex: 1,
      backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
      borderRadius: 20,
      padding: 4,
      elevation: 4,
    },
  });
