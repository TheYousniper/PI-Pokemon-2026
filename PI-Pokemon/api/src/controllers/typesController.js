
const axios = require("axios");
const { Type } = require("../models");

const getTypes = async (req, res) => {
  try {
    let types = await Type.findAll({
      order: [["name", "ASC"]],
    });

    if (types.length === 0) {
      const { data } = await axios.get(
        "https://pokeapi.co/api/v2/type"
      );

      const typesFromApi = data.results.map((type) => ({
        name: type.name,
      }));

      await Type.bulkCreate(typesFromApi, {
        ignoreDuplicates: true,
      });

      types = await Type.findAll({
        order: [["name", "ASC"]],
      });
    }

    return res.status(200).json(types);
  } catch (error) {
    return res.status(500).json({
      error: "Error al obtener los tipos de Pokémon",
      details: error.message,
    });
  }
};

module.exports = {
  getTypes,
};
