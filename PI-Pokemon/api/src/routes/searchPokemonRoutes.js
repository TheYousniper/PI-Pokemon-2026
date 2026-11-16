
const { Router } = require("express");
const {
  searchPokemon,
} = require("../controllers/searchPokemonController");

const router = Router();

router.get("/", searchPokemon);

module.exports = router;
