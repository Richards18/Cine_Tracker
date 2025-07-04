import {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({children}) => {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = async movie => {
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

  const loadFavorites = async () => {
    const favs = await AsyncStorage.getItem('favorites');
    if (favs) {
      setFavorites(JSON.parse(favs));
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <FavoritesContext.Provider value={{favorites, toggleFavorite}}>
      {children}
    </FavoritesContext.Provider>
  );
};
