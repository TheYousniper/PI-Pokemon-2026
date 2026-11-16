
const axios = require("axios");
const { Op } = require("sequelize");
const { Pokemon, Type } = require("../models");

const searchPokemon = async (req, res) => {
  try {
    const { name } = req.query;

    // Validar el parámetro de búsqueda
    if (!name || !name.trim()) {
      return res.status(400).json({
        error: "Debes proporcionar el nombre de un Pokémon",
      });
    }

    const pokemonName = name.trim();

    // 1. Buscar en PostgreSQL
    const databasePokemon = await Pokemon.findOne({
      where: {
        name: {
          [Op.iLike]: pokemonName,
        },
      },
      include: {
        model: Type,
        as: "types",
        attributes: ["id", "name"],
        through: {
          attributes: [],
        },
      },
    });

    // 2. Buscar en la PokeAPI
    let apiPokemon = null;

    try {
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(
          pokemonName.toLowerCase()
        )}`
      );

      apiPokemon = {
        id: data.id,
        name: data.name,
        image:
          data.sprites.other["official-artwork"].front_default ||
          data.sprites.front_default,
        hp: data.stats.find((stat) => stat.stat.name === "hp").base_stat,
        attack: data.stats.find((stat) => stat.stat.name === "attack").base_stat,
        defense: data.stats.find((stat) => stat.stat.name === "defense").base_stat,
        speed: data.stats.find((stat) => stat.stat.name === "speed").base_stat,
        height: data.height,
        weight: data.weight,
        types: data.types.map((type) => type.type.name),
        origin: "API",
      };
    } catch (error) {
      // Si la PokeAPI responde 404, continuamos con la búsqueda en DB
      if (error.response && error.response.status !== 404) {
        throw error;
      }
    }

    // 3. Adaptar el Pokémon de PostgreSQL
    const formattedDatabasePokemon = databasePokemon
      ? {
          id: databasePokemon.id,
          name: databasePokemon.name,
          image: databasePokemon.image,
          hp: databasePokemon.hp,
          attack: databasePokemon.attack,
          defense: databasePokemon.defense,
          speed: databasePokemon.speed,
          height: databasePokemon.height,
          weight: databasePokemon.weight,
          types: databasePokemon.types.map((type) => type.name),
          origin: "DB",
        }
      : null;

    // 4. Combinar los resultados encontrados
    const results = [
      ...(apiPokemon ? [apiPokemon] : []),
      ...(formattedDatabasePokemon ? [formattedDatabasePokemon] : []),
    ];

    if (results.length === 0) {
      return res.status(404).json({
        error: `No se encontró ningún Pokémon con el nombre "${pokemonName}"`,
      });
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({
      error: "Error al buscar el Pokémon",
      details: error.message,
    });
  }
};

module.exports = {
  searchPokemon,
};
