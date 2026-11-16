
const express = require("express");
const cors = require("cors");

const typesRoutes = require("./routes/typesRoutes");
const pokemonsRoutes = require("./routes/pokemonsRoutes");
const searchPokemonRoutes = require("./routes/searchPokemonRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor Pokémon funcionando correctamente");
});

app.use("/types", typesRoutes);

// La búsqueda debe registrarse antes de /pokemons
app.use("/pokemons/name", searchPokemonRoutes);
app.use("/pokemons", pokemonsRoutes);

module.exports = app;
