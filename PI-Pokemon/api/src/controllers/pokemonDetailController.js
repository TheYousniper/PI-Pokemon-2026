
const axios = require("axios");
const { Pokemon, Type } = require("../models");

const getPokemonDetail = async (req, res) => {
  try {
    const { idPokemon } = req.params;

    let pokemon = null;

    // 1. Verificar si el identificador es un UUID
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        idPokemon
      );

    // 2. Buscar en PostgreSQL si es un UUID
    if (isUUID) {
      const databasePokemon = await Pokemon.findByPk(idPokemon, {
        include: {
          model: Type,
          as: "types",
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
        },
      });

      if (!databasePokemon) {
        return res.status(404).json({
          error: "No se encontró el Pokémon en la base de datos",
        });
      }

      pokemon = {
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
      };

      return res.status(200).json(pokemon);
    }

    // 3. Validar que el identificador sea numérico
    if (!/^\d+$/.test(idPokemon)) {
      return res.status(400).json({
        error: "El identificador debe ser numérico o un UUID válido",
      });
    }

    // 4. Buscar en la PokeAPI
    try {
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${idPokemon}`
      );

      pokemon = {
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

      return res.status(200).json(pokemon);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({
          error: `No se encontró un Pokémon con el ID ${idPokemon}`,
        });
      }

      throw error;
    }
  } catch (error) {
    return res.status(500).json({
      error: "Error al obtener el detalle del Pokémon",
      details: error.message,
    });
  }
};

module.exports = {
  getPokemonDetail,
};
