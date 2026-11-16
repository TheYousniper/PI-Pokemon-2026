
const Pokemon = require("./Pokemon");
const Type = require("./Type");

Pokemon.belongsToMany(Type, {
  through: "PokemonType",
  foreignKey: "pokemonId",
  as: "types",
});

Type.belongsToMany(Pokemon, {
  through: "PokemonType",
  foreignKey: "typeId",
  as: "pokemons",
});

module.exports = {
  Pokemon,
  Type,
};
