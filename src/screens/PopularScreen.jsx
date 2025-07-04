import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {fetchPopularMovies} from '../services/api';
import {FavoritesContext} from '../services/FavoriteContext';
import {ThemeContext} from '../services/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PopularScreen = ({navigation}) => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const {favorites, toggleFavorite} = useContext(FavoritesContext);
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);

  useEffect(() => {
    const loadPopular = async () => {
      const res = await fetchPopularMovies();
      if (res?.results) {
        setPopularMovies(res.results);
      }
      setLoading(false);
    };
    loadPopular();
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetailScreen', {movie: item})}>
      <Image
        source={{uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`}}
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
          {item.name || item.title}
        </Text>
        <Text style={styles.year}>
          🎬{' '}
          {item.first_air_date?.slice(0, 4) || item.release_date?.slice(0, 4)}
        </Text>
        <Text style={styles.rating}>⭐ {item.vote_average?.toFixed(1)}</Text>
      </View>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>Popular Movies</Text>
        <View style={{width: 24}} />
      </View>

      {loading ? (
        <ActivityIndicator
          color="#EF4444"
          size="large"
          style={{marginTop: 40}}
        />
      ) : (
        <FlatList
          data={popularMovies}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default PopularScreen;
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
    list: {
      paddingHorizontal: 16,
      paddingBottom: 80,
    },
    card: {
      width: '48%',
      margin: '1%',
      backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f2f2f2',
      borderRadius: 10,
      overflow: 'hidden',
    },
    poster: {
      width: '100%',
      height: 200,
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
    info: {
      padding: 10,
    },
    title: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 16,
      fontWeight: '600',
    },
    year: {
      color: theme === 'dark' ? '#aaa' : '#555',
      fontSize: 13,
      marginTop: 4,
    },
    rating: {
      color: '#EF4444',
      fontWeight: 'bold',
      fontSize: 14,
      marginTop: 4,
    },
  });
