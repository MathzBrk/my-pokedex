import AsyncStorage from '@react-native-async-storage/async-storage';


const FAVORITES_KEY = '@mypokedex/favorites:v2';


export type FavoritePokemon = {
 id: number;
 name: string;
 imageUrl: string;
 types: string[];
 savedAt: string;
};


export async function getFavoritePokemons(): Promise<FavoritePokemon[]> {
 const raw = await AsyncStorage.getItem(FAVORITES_KEY);
 if (!raw) return [];
 return JSON.parse(raw) as FavoritePokemon[];
}


export async function getFavoriteIds(): Promise<number[]> {
 const favorites = await getFavoritePokemons();
 return favorites.map((pokemon) => pokemon.id);
}


export async function isFavorite(id: number): Promise<boolean> {
 const favorites = await getFavoritePokemons();
 return favorites.some((pokemon) => pokemon.id === id);
}


export async function toggleFavorite(pokemon: Omit<FavoritePokemon, 'savedAt'>): Promise<FavoritePokemon[]> {
 const favorites = await getFavoritePokemons();
 const exists = favorites.some((item) => item.id === pokemon.id);


 const updated = exists
   ? favorites.filter((item) => item.id !== pokemon.id)
   : [...favorites, { ...pokemon, savedAt: new Date().toISOString() }];


 await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
 return updated;
}

export async function clearFavorites(): Promise<void> {
 await AsyncStorage.removeItem(FAVORITES_KEY);
}

const lastViewedPokemonKey = '@mypokedex/lastViewedPokemon';

export async function saveLastViewedPokemon(pokemon: Omit<FavoritePokemon, 'savedAt'>): Promise<void> {
  await AsyncStorage.removeItem(lastViewedPokemonKey);
 await AsyncStorage.setItem(lastViewedPokemonKey, JSON.stringify({ ...pokemon, savedAt: new Date().toISOString() }));
}

export async function getLastViewedPokemon(): Promise<FavoritePokemon | null> {
 const raw = await AsyncStorage.getItem(lastViewedPokemonKey);
 if (!raw) return null;
 return JSON.parse(raw) as FavoritePokemon;
}
