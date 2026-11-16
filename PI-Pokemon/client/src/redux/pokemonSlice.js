
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getPokemons,
  getTypes,
  getPokemonById,
  searchPokemon,
  createPokemon,
} from "../services/pokemonApi";

// Obtener todos los Pokémon
export const fetchPokemons = createAsyncThunk(
  "pokemon/fetchPokemons",
  async (_, { rejectWithValue }) => {
    try {
      return await getPokemons();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Error al obtener los Pokémon"
      );
    }
  }
);

// Obtener todos los tipos
export const fetchTypes = createAsyncThunk(
  "pokemon/fetchTypes",
  async (_, { rejectWithValue }) => {
    try {
      return await getTypes();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Error al obtener los tipos"
      );
    }
  }
);

// Obtener detalle de un Pokémon
export const fetchPokemonById = createAsyncThunk(
  "pokemon/fetchPokemonById",
  async (id, { rejectWithValue }) => {
    try {
      return await getPokemonById(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Error al obtener el Pokémon"
      );
    }
  }
);

// Buscar Pokémon por nombre
export const fetchPokemonByName = createAsyncThunk(
  "pokemon/fetchPokemonByName",
  async (name, { rejectWithValue }) => {
    try {
      return await searchPokemon(name);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "No se encontró el Pokémon"
      );
    }
  }
);

// Crear Pokémon
export const addPokemon = createAsyncThunk(
  "pokemon/addPokemon",
  async (pokemon, { rejectWithValue }) => {
    try {
      return await createPokemon(pokemon);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Error al crear el Pokémon"
      );
    }
  }
);

const initialState = {
  pokemons: [],
  types: [],
  pokemonDetail: null,
  searchResults: [],
  isLoading: false,
  error: null,
};

const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    clearPokemonDetail: (state) => {
      state.pokemonDetail = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener Pokémon
      .addCase(fetchPokemons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPokemons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pokemons = action.payload;
      })
      .addCase(fetchPokemons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Obtener tipos
      .addCase(fetchTypes.fulfilled, (state, action) => {
        state.types = action.payload;
      })
      .addCase(fetchTypes.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Obtener detalle
      .addCase(fetchPokemonById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPokemonById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pokemonDetail = action.payload;
      })
      .addCase(fetchPokemonById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Buscar por nombre
      .addCase(fetchPokemonByName.pending, (state) => {
        state.error = null;
        state.searchResults = [];
      })
      .addCase(fetchPokemonByName.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      })
      .addCase(fetchPokemonByName.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Crear Pokémon
      .addCase(addPokemon.fulfilled, (state, action) => {
        state.pokemons.push(action.payload);
      })
      .addCase(addPokemon.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  clearPokemonDetail,
  clearSearchResults,
} = pokemonSlice.actions;

export default pokemonSlice.reducer;
