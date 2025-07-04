import axios from 'axios';
import {TMDB_TOKEN} from '@env';

const TRENDING_URL = 'https://api.themoviedb.org/3/trending/movie/week';
const POPULAR_URL =
  'https://api.themoviedb.org/3/tv/popular?language=en-US&page=1';

export const fetchTrendingMovies = async () => {
  try {
    const response = await axios.get(TRENDING_URL, {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        accept: 'application/json',
      },
    });
    return response.data;
  } catch (err) {
    console.error('Failed to load trending movies:', err);
    return null;
  }
};

export const fetchPopularMovies = async () => {
  try {
    const response = await axios.get(POPULAR_URL, {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        accept: 'application/json',
      },
    });
    return response.data;
  } catch (err) {
    console.error('Failed to load trending movies:', err);
    return null;
  }
};

export const searchMovies = async query => {
  try {
    const response = await axios.get(
      'https://api.themoviedb.org/3/search/movie',
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TMDB_TOKEN}`,
        },
        params: {
          query: query,
          include_adult: false,
          language: 'en-US',
          page: 1,
        },
      },
    );
    return response.data.results;
  } catch (error) {
    console.error('Search API error:', error.message);
    return [];
  }
};
