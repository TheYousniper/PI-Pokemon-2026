import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchPokemons,
  fetchTypes,
  fetchPokemonByName,
  clearSearchResults,
} from "../redux/pokemonSlice";

import PokemonCard from "../components/PokemonCard";
import "../styles/Home.css";

const ITEMS_PER_PAGE = 12;

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { pokemons, types, searchResults, isLoading, error } = useSelector(
    (state) => state.pokemon,
  );

  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedOrigin, setSelectedOrigin] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchMessage, setSearchMessage] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (pokemons.length === 0) {
      dispatch(fetchPokemons());
    }

    if (types.length === 0) {
      dispatch(fetchTypes());
    }
  }, [dispatch, pokemons.length, types.length]);

  const handleSearch = async (event) => {
    event.preventDefault();

    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      handleClearSearch();
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setSearchMessage("");
    setCurrentPage(1);

    try {
      const result = await dispatch(fetchPokemonByName(searchValue)).unwrap();

      if (!result || result.length === 0) {
        setSearchMessage("No se encontró ningún Pokémon con ese nombre.");
      }
    } catch (error) {
      setSearchMessage("No se pudo realizar la búsqueda.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    setIsSearching(false);
    setHasSearched(false);
    setSearchMessage("");
    dispatch(clearSearchResults());
    setCurrentPage(1);
  };

  const sourcePokemons = hasSearched ? searchResults : pokemons;

  const filteredPokemons = useMemo(() => {
    let result = [...sourcePokemons];

    if (selectedType !== "all") {
      result = result.filter((pokemon) =>
        pokemon.types?.some((type) => type.toLowerCase() === selectedType),
      );
    }

    if (selectedOrigin !== "all") {
      result = result.filter((pokemon) => pokemon.origin === selectedOrigin);
    }

    if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortBy === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    if (sortBy === "attack-asc") {
      result.sort((a, b) => a.attack - b.attack);
    }

    if (sortBy === "attack-desc") {
      result.sort((a, b) => b.attack - a.attack);
    }

    return result;
  }, [sourcePokemons, selectedType, selectedOrigin, sortBy]);

  const totalPages = Math.ceil(filteredPokemons.length / ITEMS_PER_PAGE);

  const currentPokemons = filteredPokemons.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleFilterChange = (callback, value) => {
    callback(value);
    setCurrentPage(1);
  };

  return (
    <main className="home">
      <header className="home-header">
        <div className="home-logo" onClick={() => navigate("/")}>
          POKE<span>WORLD</span>
        </div>

        <div className="home-header-info">
          <span className="online-indicator"></span>
          DATABASE ONLINE
        </div>
        <button
          className="create-nav-button"
          onClick={() => navigate("/create")}
        >
          + CREAR POKÉMON
        </button>
      </header>

      <section className="home-hero">
        <div>
          <span className="home-subtitle">POKÉMON DATABASE SYSTEM</span>

          <h1>
            POKÉDEX <span>EXPLORER</span>
          </h1>

          <p>
            Explora el universo Pokémon y descubre sus características,
            habilidades y tipos.
          </p>
        </div>

        <div className="home-counter">
          <strong>{pokemons.length}</strong>
          <span>POKÉMON REGISTRADOS</span>
        </div>
      </section>

      <section className="home-controls">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar Pokémon por nombre..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          {search && (
            <button
              type="button"
              className="clear-search"
              onClick={handleClearSearch}
            >
              ✕
            </button>
          )}

          <button type="submit" disabled={isSearching}>
            {isSearching ? "BUSCANDO..." : "BUSCAR"}
          </button>
        </form>

        <div className="filters">
          <label>
            TIPO
            <select
              value={selectedType}
              onChange={(event) =>
                handleFilterChange(setSelectedType, event.target.value)
              }
            >
              <option value="all">Todos los tipos</option>

              {types.map((type) => (
                <option key={type.id} value={type.name.toLowerCase()}>
                  {type.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            ORIGEN
            <select
              value={selectedOrigin}
              onChange={(event) =>
                handleFilterChange(setSelectedOrigin, event.target.value)
              }
            >
              <option value="all">Todos</option>
              <option value="API">PokéAPI</option>
              <option value="DB">Base de datos</option>
            </select>
          </label>

          <label>
            ORDENAR POR
            <select
              value={sortBy}
              onChange={(event) =>
                handleFilterChange(setSortBy, event.target.value)
              }
            >
              <option value="default">Predeterminado</option>
              <option value="name-asc">Nombre A - Z</option>
              <option value="name-desc">Nombre Z - A</option>
              <option value="attack-asc">Menor ataque</option>
              <option value="attack-desc">Mayor ataque</option>
            </select>
          </label>
        </div>
      </section>

      <section className="pokemon-results">
        <div className="results-heading">
          <div>
            <span>DATABASE RESULTS</span>
            <h2>POKÉMON ENCONTRADOS</h2>
          </div>

          <span className="results-count">
            {filteredPokemons.length} RESULTADOS
          </span>
        </div>

        {(isLoading || isSearching) && (
          <div className="home-message">
            <div className="loading-spinner"></div>
            <p>CARGANDO INFORMACIÓN...</p>
          </div>
        )}

        {error && !isLoading && <p className="home-error">{error}</p>}

        {searchMessage && !isSearching && (
          <p className="home-message">{searchMessage}</p>
        )}

        {!isLoading && !isSearching && !searchMessage && (
          <>
            {currentPokemons.length > 0 ? (
              <div className="pokemon-grid">
                {currentPokemons.map((pokemon) => (
                  <PokemonCard
                    key={`${pokemon.origin}-${pokemon.id}`}
                    pokemon={pokemon}
                    onSelect={(id) => navigate(`/pokemon/${id}`)}
                  />
                ))}
              </div>
            ) : (
              <p className="home-message">
                No hay Pokémon que coincidan con los filtros seleccionados.
              </p>
            )}

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => page - 1)}
                >
                  ANTERIOR
                </button>

                <span>
                  PÁGINA <strong>{currentPage}</strong> DE {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((page) => page + 1)}
                >
                  SIGUIENTE
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default Home;
