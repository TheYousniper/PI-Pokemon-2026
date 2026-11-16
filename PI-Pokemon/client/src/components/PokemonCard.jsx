
import "../styles/PokemonCard.css";

const PokemonCard = ({ pokemon, onSelect }) => {
  const typeColors = {
    normal: "#a8a878",
    fire: "#f08030",
    water: "#6890f0",
    electric: "#f8d030",
    grass: "#78c850",
    ice: "#98d8d8",
    fighting: "#c03028",
    poison: "#a040a0",
    ground: "#e0c068",
    flying: "#a890f0",
    psychic: "#f85888",
    bug: "#a8b820",
    rock: "#b8a038",
    ghost: "#705898",
    dragon: "#7038f8",
    dark: "#705848",
    steel: "#b8b8d0",
    fairy: "#ee99ac",
  };

  const pokemonNumber = Number.isInteger(Number(pokemon.id))
    ? `#${String(pokemon.id).padStart(4, "0")}`
    : "DB";

  const origin = pokemon.origin?.toUpperCase() || "API";

  const types = (pokemon.types || []).map((type) => {
    return typeof type === "string" ? type : type?.name || "";
  }).filter(Boolean);

  return (
    <article
      className="pokemon-card"
      onClick={() => onSelect(pokemon.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(pokemon.id);
        }
      }}
    >
      <div className="pokemon-card-top">
        <span className="pokemon-number">{pokemonNumber}</span>

        <span className={`pokemon-origin ${origin.toLowerCase()}`}>
          {origin === "DB" ? "DATABASE" : "POKEAPI"}
        </span>
      </div>

      <div className="pokemon-image-container">
        <div className="pokemon-image-glow"></div>

        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="pokemon-image"
          loading="lazy"
        />
      </div>

      <div className="pokemon-card-info">
        <h3>{pokemon.name}</h3>

        <div className="pokemon-types">
          {types.map((type) => (
            <span
              key={type}
              className="pokemon-type"
              style={{
                backgroundColor:
                  typeColors[type.toLowerCase()] || "#64748b",
              }}
            >
              {type.toUpperCase()}
            </span>
          ))}
        </div>

        <div className="pokemon-card-stats">
          <div>
            <span>HP</span>
            <strong>{pokemon.hp}</strong>
          </div>

          <div>
            <span>ATTACK</span>
            <strong>{pokemon.attack}</strong>
          </div>

          <div>
            <span>DEFENSE</span>
            <strong>{pokemon.defense}</strong>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PokemonCard;
