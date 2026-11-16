
import axios from "axios";

const pokemonApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getPokemons = async () => {
  const { data } = await pokemonApi.get("/pokemons");
  return data;
};

export const getTypes = async () => {
  const { data } = await pokemonApi.get("/types");
  return data;
};

export const getPokemonById = async (id) => {
  const { data } = await pokemonApi.get(`/pokemons/${id}`);
  return data;
};

export const searchPokemon = async (name) => {
  const { data } = await pokemonApi.get("/pokemons/name", {
    params: { name },
  });

  return data;
};

export const createPokemon = async (pokemon) => {
  const { data } = await pokemonApi.post("/pokemons", pokemon);
  return data;
};
