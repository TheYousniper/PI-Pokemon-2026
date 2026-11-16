
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchPokemonById,
  clearPokemonDetail,
} from "../redux/pokemonSlice";
import "../styles/Detail.css";

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

const Detail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { pokemonDetail } = useSelector((state) => state.pokemon);

  const [loading, setLoading] = useState(true);
  const [detailError, setDetailError] = useState("");

  useEffect(() => {
    let active = true;

    const loadPokemon = async () => {
      setLoading(true);
      setDetailError("");

      dispatch(clearPokemonDetail());

      try {
        await dispatch(fetchPokemonById(id)).unwrap();
      } catch (error) {
        if (active) {
          setDetailError(
            typeof error === "string"
              ? error
              : "No se pudo cargar la información del Pokémon."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPokemon();

    return () => {
      active = false;
    };
  }, [dispatch, id]);

  const pokemonTypes = useMemo(() => {
    const types = pokemonDetail?.types || [];

    return types.map((type) =>
      typeof type === "string" ? type : type.name
    ).filter(Boolean);
  }, [pokemonDetail]);

  const pokemonNumber = Number.isInteger(Number(pokemonDetail?.id))
    ? `#${String(pokemonDetail.id).padStart(4, "0")}`
    : "POKÉMON DATABASE";

  if (loading) {
    return (
      <main className="detail-screen">
        <div className="detail-loading">
          <div className="detail-spinner"></div>
          <p>LOADING POKÉMON DATA...</p>
        </div>
      </main>
    );
  }

  if (detailError || !pokemonDetail) {
    return (
      <main className="detail-screen">
        <div className="detail-error">
          <h1>POKÉMON NO ENCONTRADO</h1>
          <p>{detailError || "No existe información para este Pokémon."}</p>
          <button onClick={() => navigate("/home")}>
            VOLVER AL POKÉDEX
          </button>
        </div>
      </main>
    );
  }

  const stats = [
    { label: "HP", value: pokemonDetail.hp, color: "#ef4444" },
    { label: "ATTACK", value: pokemonDetail.attack, color: "#f97316" },
    { label: "DEFENSE", value: pokemonDetail.defense, color: "#eab308" },
    { label: "SPEED", value: pokemonDetail.speed, color: "#06b6d4" },
  ];

  const maxStat = 255;

  return (
    <main className="detail-screen">
      <header className="detail-header">
        <button
          className="detail-back"
          onClick={() => navigate("/home")}
        >
          ← VOLVER AL POKÉDEX
        </button>

        <span className="detail-system">POKEWORLD / DATABASE</span>
      </header>

      <section className="detail-content">
        <div className="detail-art">
          <span className="detail-number">{pokemonNumber}</span>

          <div className="detail-orbit"></div>
          <div className="detail-orbit detail-orbit-two"></div>

          <img
            src={pokemonDetail.image}
            alt={pokemonDetail.name}
          />

          <span className="detail-art-caption">
            {pokemonDetail.origin === "DB"
              ? "DATABASE POKÉMON"
              : "POKÉAPI POKÉMON"}
          </span>
        </div>

        <div className="detail-information">
          <span className="detail-label">POKÉMON PROFILE</span>

          <h1>{pokemonDetail.name}</h1>

          <div className="detail-types">
            {pokemonTypes.map((type) => (
              <span
                key={type}
                style={{
                  backgroundColor:
                    typeColors[type.toLowerCase()] || "#64748b",
                }}
              >
                {type}
              </span>
            ))}
          </div>

          <div className="detail-measures">
            <article>
              <span>HEIGHT</span>
              <strong>{pokemonDetail.height ?? "—"}</strong>
              <small>Metros</small>
            </article>

            <article>
              <span>WEIGHT</span>
              <strong>{pokemonDetail.weight ?? "—"}</strong>
              <small>Kg</small>
            </article>
          </div>

          <div className="detail-stats">
            <div className="detail-stats-heading">
              <h2>BASE STATS</h2>
              <span>COMBAT DATA</span>
            </div>

            {stats.map((stat) => {
              const value = Number(stat.value) || 0;
              const percentage = Math.min(
                (value / maxStat) * 100,
                100
              );

              return (
                <div className="detail-stat" key={stat.label}>
                  <div className="detail-stat-label">
                    <span>{stat.label}</span>
                    <strong>{value}</strong>
                  </div>

                  <div className="detail-stat-track">
                    <div
                      className="detail-stat-fill"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: stat.color,
                        boxShadow: `0 0 12px ${stat.color}88`,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Detail;
