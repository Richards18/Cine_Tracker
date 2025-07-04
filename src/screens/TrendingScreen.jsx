import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {fetchTrendingMovies} from '../services/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ThemeContext} from '../services/ThemeContext';
import {FavoritesContext} from '../services/FavoriteContext';

const TrendingScreen = ({navigation}) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const {theme} = useContext(ThemeContext);
  const {favorites, toggleFavorite} = useContext(FavoritesContext);
  const styles = getStyles(theme);

  useEffect(() => {
    const loadTrendingMovies = async () => {
      const res = await fetchTrendingMovies();
      if (res?.results) setMovies(res.results);
      setLoading(false);
    };
    loadTrendingMovies();
  }, []);

  const renderMovieGrid = () => {
    const moviePairs = [];
    for (let i = 0; i < movies.length; i += 2) {
      moviePairs.push(movies.slice(i, i + 2));
    }

    return moviePairs.map((pair, index) => (
      <View key={index} style={styles.row}>
        {pair.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => navigation.navigate('DetailScreen', {movie: item})}>
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${
                  item.poster_path || item.backdrop_path
                }`,
              }}
              style={styles.poster}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.favoriteIcon}
              onPress={e => {
                e.stopPropagation();
                toggleFavorite(item);
              }}>
              <Icon
                name={
                  favorites.some(fav => fav.id === item.id)
                    ? 'heart'
                    : 'heart-outline'
                }
                size={20}
                color="#EF4444"
              />
            </TouchableOpacity>
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.year}>
                🎬 {item.release_date?.slice(0, 4)}
              </Text>
              <Text style={styles.rating}>
                ⭐ {item.vote_average?.toFixed(1)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme === 'dark' ? '#121212' : '#FFFFFF'}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={24}
            color={theme === 'dark' ? '#fff' : '#000'}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trending Movies</Text>
        <View style={{width: 24}} />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#EF4444"
          style={{marginTop: 40}}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {renderMovieGrid()}
        </ScrollView>
      )}
    </View>
  );
};

export default TrendingScreen;
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
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#fff' : '#000',
    },
    scrollContainer: {
      padding: 16,
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
    },
    poster: {
      width: '100%',
      height: 200,
    },
    info: {
      padding: 10,
    },
    title: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    year: {
      color: theme === 'dark' ? '#aaa' : '#666',
      fontSize: 13,
      marginBottom: 2,
    },
    rating: {
      color: '#EF4444',
      fontWeight: 'bold',
      fontSize: 14,
    },
    favoriteIcon: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 12,
      padding: 4,
      zIndex: 1,
    },
  });
