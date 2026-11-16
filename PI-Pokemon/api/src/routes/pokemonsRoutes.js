
const { Router } = require("express");

const {
  getPokemons,
} = require("../controllers/pokemonsController");

const {
  getPokemonDetail,
} = require("../controllers/pokemonDetailController");

const {
  createPokemon,
} = require("../controllers/createPokemonController");

const router = Router();

router.get("/", getPokemons);
router.post("/", createPokemon);
router.get("/:idPokemon", getPokemonDetail);

module.exports = router;
