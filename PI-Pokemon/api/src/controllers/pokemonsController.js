
const axios = require("axios");
const { Pokemon, Type } = require("../models");

const getPokemons = async (req, res) => {
  try {
    // 1. Obtener la lista de Pokémon de la PokeAPI
    const { data } = await axios.get(
      "https://pokeapi.co/api/v2/pokemon?limit=100000"
    );

    const pokemonList = data.results;
    const apiPokemons = [];

    // 2. Consultar los detalles en bloques de 25 Pokémon
    const chunkSize = 25;

    for (let i = 0; i < pokemonList.length; i += chunkSize) {
      const chunk = pokemonList.slice(i, i + chunkSize);

      const details = await Promise.all(
        chunk.map(async (pokemon) => {
          const response = await axios.get(pokemon.url);
          const item = response.data;

          return {
            id: item.id,
            name: item.name,
            image:
              item.sprites.other["official-artwork"].front_default ||
              item.sprites.front_default,
            hp: item.stats.find((stat) => stat.stat.name === "hp").base_stat,
            attack: item.stats.find((stat) => stat.stat.name === "attack").base_stat,
            defense: item.stats.find((stat) => stat.stat.name === "defense").base_stat,
            speed: item.stats.find((stat) => stat.stat.name === "speed").base_stat,
            height: item.height,
            weight: item.weight,
            types: item.types.map((type) => type.type.name),
            origin: "API",
          };
        })
      );

      apiPokemons.push(...details);
    }

    // 3. Obtener los Pokémon guardados en PostgreSQL
    const databasePokemons = await Pokemon.findAll({
      include: {
        model: Type,
        as: "types",
        attributes: ["id", "name"],
        through: {
          attributes: [],
        },
      },
    });

    // 4. Adaptar los registros de PostgreSQL
    const formattedDatabasePokemons = databasePokemons.map((pokemon) => ({
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.image,
      hp: pokemon.hp,
      attack: pokemon.attack,
      defense: pokemon.defense,
      speed: pokemon.speed,
      height: pokemon.height,
      weight: pokemon.weight,
      types: pokemon.types.map((type) => type.name),
      origin: "DB",
    }));

    // 5. Combinar ambas listas
    const allPokemons = [
      ...apiPokemons,
      ...formattedDatabasePokemons,
    ];

    return res.status(200).json(allPokemons);
  } catch (error) {
    return res.status(500).json({
      error: "Error al obtener los Pokémon",
      details: error.message,
    });
  }
};

module.exports = {
  getPokemons,
};
