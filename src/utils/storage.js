import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from 'react';

const [favorites, setFavorites] = useState([]);

export const toggleFavorite = async movie => {
  const updated = [...favorites];
  const index = updated.findIndex(fav => fav.id === movie.id);

  if (index >= 0) {
    updated.splice(index, 1);
  } else {
    updated.push(movie);
  }

  setFavorites(updated);
  await AsyncStorage.setItem('favorites', JSON.stringify(updated));
};
