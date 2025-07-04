import React, {useContext} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {GENRES} from '../utils/constant';
import {ThemeContext} from '../services/ThemeContext';

const DetailScreen = ({route, navigation}) => {
  const {movie} = route.params;
  const {theme} = useContext(ThemeContext);
  const dynamicStyles = getStyles(theme);

  const getGenreNames = (ids = []) => {
    return ids
      .map(id => {
        const genre = GENRES.genres.find(g => g.id === id);
        return genre ? genre.name : null;
      })
      .filter(Boolean)
      .join(', ');
  };

  return (
    <ScrollView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <TouchableOpacity
          style={dynamicStyles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={dynamicStyles.posterContainer}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${
              movie.backdrop_path || movie.poster_path
            }`,
          }}
          style={dynamicStyles.poster}
        />
      </View>

      <View style={dynamicStyles.content}>
        <Text style={dynamicStyles.title}>{movie.title || movie.name}</Text>

        <View style={dynamicStyles.detailsRow}>
          <Text style={dynamicStyles.year}>
            🎬 {movie.release_date?.slice(0, 4)}
          </Text>
          <Text style={dynamicStyles.rating}>
            ⭐ {movie.vote_average?.toFixed(1)}
          </Text>
        </View>

        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Overview/plot</Text>
          <Text style={dynamicStyles.overview}>
            {movie.overview || 'No overview available for this movie.'}
          </Text>
        </View>
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Genres</Text>
          <Text style={dynamicStyles.genres}>
            {getGenreNames(movie.genre_ids)}
          </Text>
        </View>

        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Average Rating</Text>
          <Text style={dynamicStyles.genres}>{movie.vote_average}</Text>
        </View>
        {movie.popularity && (
          <View style={dynamicStyles.section}>
            <Text style={dynamicStyles.sectionTitle}>Popularity</Text>
            <Text style={dynamicStyles.popularity}>
              {movie.popularity.toFixed(0)} points
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#1A1A1A' : '#FFFFFF',
    },
    header: {
      position: 'absolute',
      top: 50,
      left: 20,
      zIndex: 1,
    },
    backButton: {
      backgroundColor:
        theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
      borderRadius: 20,
      padding: 8,
    },
    posterContainer: {
      alignItems: 'center',
      paddingTop: 60,
      paddingBottom: 20,
    },
    poster: {
      width: 200,
      height: 300,
      borderRadius: 10,
    },
    content: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
      textAlign: 'center',
      marginBottom: 15,
    },
    detailsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
      marginBottom: 20,
    },
    year: {
      fontSize: 16,
      color: theme === 'dark' ? '#CCCCCC' : '#444444',
    },
    rating: {
      fontSize: 16,
      color: theme === 'dark' ? '#CCCCCC' : '#444444',
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
      marginBottom: 8,
    },
    overview: {
      fontSize: 16,
      color: theme === 'dark' ? '#CCCCCC' : '#444444',
      lineHeight: 24,
    },
    genres: {
      fontSize: 16,
      color: theme === 'dark' ? '#CCCCCC' : '#444444',
    },
    popularity: {
      fontSize: 16,
      color: theme === 'dark' ? '#CCCCCC' : '#444444',
    },
  });

export default DetailScreen;
