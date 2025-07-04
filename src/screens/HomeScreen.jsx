import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  fetchPopularMovies,
  fetchTrendingMovies,
  searchMovies,
} from '../services/api';
import NetInfo from '@react-native-community/netinfo';
import {useContext} from 'react';
import {FavoritesContext} from '../services/FavoriteContext';
import {ThemeContext} from '../services/ThemeContext';
import Icon1 from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({navigation}) => {
  const [movies, setMovies] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  const {favorites, toggleFavorite} = useContext(FavoritesContext);
  const {theme, toggleTheme} = useContext(ThemeContext);

  const dynamicStyles = getStyles(theme);

  const loadMovies = async () => {
    const res = await fetchTrendingMovies();
    if (res?.results) setMovies(res.results);
    setLoading(false);
  };

  const loadPop = async () => {
    const res = await fetchPopularMovies();
    if (res?.results) setPopular(res.results);
    setLoading(false);
  };

  const handleSearch = async query => {
    if (query.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchMovies(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    loadMovies();
    loadPop();

    return () => unsubscribe();
  }, []);

  const renderMovieGrid = (movieList = movies) => {
    const moviePairs = [];
    for (let i = 0; i < movieList.length; i += 2) {
      moviePairs.push(movieList.slice(i, i + 2));
    }

    return moviePairs.map((pair, index) => (
      <View key={index} style={dynamicStyles.row}>
        {pair.map(item => (
          <TouchableOpacity
            key={item.id}
            style={dynamicStyles.card}
            onPress={() => navigation.navigate('DetailScreen', {movie: item})}>
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${
                  item.backdrop_path || item.poster_path
                }`,
              }}
              style={dynamicStyles.poster}
            />
            <TouchableOpacity
              style={dynamicStyles.favoriteIcon}
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
            <View style={dynamicStyles.info}>
              <Text style={dynamicStyles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={dynamicStyles.year}>
                🎬 {item.release_date?.slice(0, 4)}
              </Text>
              <Text style={dynamicStyles.rating}>
                ⭐ {item.vote_average?.toFixed(1)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  const renderPopularMovie = () => {
    const limitedPopular = popular.slice(0, 4);

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 16}}>
        {limitedPopular.map(item => (
          <TouchableOpacity
            key={item.id}
            style={dynamicStyles.popularCard}
            onPress={() => navigation.navigate('DetailScreen', {movie: item})}>
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${
                  item.backdrop_path || item.poster_path
                }`,
              }}
              style={dynamicStyles.popularPoster}
            />
            <TouchableOpacity
              style={dynamicStyles.favoriteIcon}
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
            <View style={dynamicStyles.popularInfo}>
              <Text style={dynamicStyles.popularTitle} numberOfLines={2}>
                {item.name || item.title}
              </Text>
              <Text style={dynamicStyles.popularYear}>
                🎬{' '}
                {item.first_air_date?.slice(0, 4) ||
                  item.release_date?.slice(0, 4)}
              </Text>
              <Text style={dynamicStyles.popularRating}>
                ⭐ {item.vote_average?.toFixed(1)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* View All Card */}
        <TouchableOpacity
          style={[
            dynamicStyles.popularCard,
            {justifyContent: 'center', alignItems: 'center'},
          ]}
          onPress={() => navigation.navigate('PopularScreen')}>
          <Text
            style={{
              color: theme === 'dark' ? '#fff' : '#000',
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            View All
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme === 'dark' ? '#121212' : '#FFFFFF'}
        translucent={false}
      />
      {!isConnected ? (
        <View style={dynamicStyles.noInternetContainer}>
          <Text style={dynamicStyles.noInternetText}>
            ⚠️ No internet connection. Please check your connection.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('FavoritesScreen')}>
            <Text style={[dynamicStyles.noInternetText, {marginTop: 10}]}>
              Go to Favorites Screen
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={dynamicStyles.header}>
            <View>
              <Text style={dynamicStyles.greeting}>Cine Tracker</Text>
              <Text style={dynamicStyles.location}>
                Discover. Favorite. Rewatch.
              </Text>
            </View>
            <View style={dynamicStyles.icons}>
              <TouchableOpacity
                onPress={toggleTheme}
                style={dynamicStyles.themeButton}>
                <Icon
                  name={theme === 'dark' ? 'weather-sunny' : 'weather-night'}
                  size={24}
                  color={theme === 'dark' ? '#FFF' : '#000'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('ProfileScreen')}>
                <Icon
                  name="account-circle"
                  size={28}
                  color={theme === 'dark' ? '#FFF' : '#000'}
                  style={{marginLeft: 15}}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={dynamicStyles.searchContainer}>
            <Icon1
              name="search"
              size={22}
              color={theme === 'dark' ? '#888' : '#666'}
              style={dynamicStyles.searchIcon}
            />
            <TextInput
              placeholder="Search movies..."
              placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
              style={dynamicStyles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <Icon1
                  name="close"
                  size={20}
                  color={theme === 'dark' ? '#888' : '#666'}
                />
              </TouchableOpacity>
            )}
          </View>

          {searchQuery.length > 0 ? (
            <View>
              <View style={dynamicStyles.header}>
                <Text style={dynamicStyles.heading}>
                  🔍 Search Results ({searchResults.length})
                </Text>
              </View>

              {isSearching ? (
                <ActivityIndicator
                  color="#EF4444"
                  size="large"
                  style={{marginTop: 40}}
                />
              ) : searchResults.length === 0 ? (
                <View style={dynamicStyles.noResultsContainer}>
                  <Text style={dynamicStyles.noResultsText}>
                    No movies found for "{searchQuery}"
                  </Text>
                </View>
              ) : (
                <View style={dynamicStyles.moviesContainer}>
                  {renderMovieGrid(searchResults)}
                </View>
              )}
            </View>
          ) : (
            <>
              <View style={dynamicStyles.header}>
                <Text style={dynamicStyles.heading}>🔥 Trending Movies</Text>
              </View>

              {loading ? (
                <ActivityIndicator
                  color="#EF4444"
                  size="large"
                  style={{marginTop: 40}}
                />
              ) : (
                <View style={dynamicStyles.moviesContainer}>
                  {renderMovieGrid(movies.slice(0, 6))}
                  <TouchableOpacity
                    onPress={() => navigation.navigate('TrendingScreen')}
                    style={{alignSelf: 'center', marginTop: 10}}>
                    <Text
                      style={{
                        color: theme === 'dark' ? '#FFFFFF' : '#000000',
                        fontWeight: 'bold',
                        fontSize: 16,
                      }}>
                      See All
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={dynamicStyles.header}>
                <Text style={dynamicStyles.heading}>🔥 Popular Movies</Text>
              </View>

              {loading ? (
                <ActivityIndicator
                  color="#EF4444"
                  size="large"
                  style={{marginTop: 40}}
                />
              ) : (
                <View style={{marginTop: 10, marginBottom: 50}}>
                  {renderPopularMovie()}
                </View>
              )}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
      alignItems: 'center',
      paddingTop: 20,
    },
    heading: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 24,
      fontWeight: 'bold',
    },
    moviesContainer: {
      padding: 16,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    card: {
      width: '48%',
      backgroundColor: theme === 'dark' ? '#1e1e1e' : '#F5F5F5',
      borderRadius: 10,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: theme === 'dark' ? '#000' : '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    poster: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
    },
    info: {
      padding: 12,
    },
    title: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 6,
    },
    year: {
      color: theme === 'dark' ? '#aaa' : '#666',
      fontSize: 13,
      marginBottom: 4,
    },
    rating: {
      color: '#EF4444',
      fontWeight: 'bold',
      fontSize: 14,
    },
    greeting: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 18,
      fontWeight: 'bold',
    },
    icons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    themeButton: {
      padding: 4,
    },
    popularCard: {
      width: 140,
      marginRight: 12,
      backgroundColor: theme === 'dark' ? '#1e1e1e' : '#F5F5F5',
      borderRadius: 10,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: theme === 'dark' ? '#000' : '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    popularPoster: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
    },
    popularTitle: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 14,
      fontWeight: '600',
    },
    popularInfo: {
      padding: 8,
    },
    popularYear: {
      color: theme === 'dark' ? '#aaa' : '#666',
      fontSize: 12,
      marginTop: 4,
    },
    popularRating: {
      color: '#EF4444',
      fontWeight: 'bold',
      fontSize: 13,
      marginTop: 2,
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
    noInternetContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    noInternetText: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 16,
      textAlign: 'center',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#1e1e1e' : '#F5F5F5',
      borderRadius: 10,
      marginHorizontal: 16,
      marginBottom: 16,
      paddingHorizontal: 12,
      height: 48,
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#333' : '#E0E0E0',
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 16,
    },
    noResultsContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    noResultsText: {
      color: theme === 'dark' ? '#aaa' : '#666',
      fontSize: 16,
      textAlign: 'center',
    },
    location: {
      color: theme === 'dark' ? '#aaa' : '#666',
    },
  });

export default HomeScreen;
