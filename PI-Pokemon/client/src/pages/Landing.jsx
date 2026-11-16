
import { useNavigate } from "react-router-dom";
import "../styles/Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <main className="landing">
      <div className="landing-grid"></div>

      <nav className="landing-navbar">
        <h2 className="landing-logo">
          POKE<span>WORLD</span>
        </h2>

        <span className="landing-version">
          POKÉMON DATABASE
        </span>
      </nav>

      <section className="landing-content">
        <div className="landing-info">
          <span className="landing-tag">
            <span className="status-dot"></span>
            SYSTEM ONLINE
          </span>

          <h1>
            EXPLORE THE
            <span> POKÉMON</span>
            <br />
            UNIVERSE
          </h1>

          <p>
            Descubre, busca y conoce todos los Pokémon.
            Explora sus habilidades, estadísticas y tipos
            en una experiencia diseñada para entrenadores.
          </p>

          <button
            className="landing-button"
            onClick={() => navigate("/home")}
          >
            <span>COMENZAR A EXPLORAR</span>
            <span className="button-arrow">➜</span>
          </button>

          <div className="landing-footer-info">
            <span>1352+ POKÉMON</span>
            <span>20 TIPOS</span>
            <span>POKÉDEX DATABASE</span>
          </div>
        </div>

        <div className="landing-art">
          <div className="energy-circle"></div>
          <div className="energy-circle energy-circle-two"></div>

          <span className="art-label">#006</span>

          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png"
            alt="Charizard"
          />

          <div className="pokemon-name">
            <span>FIRE / FLYING</span>
            <h2>CHARIZARD</h2>
          </div>
        </div>
      </section>

      <div className="landing-bottom">
        <span>POKÉWORLD © 2026</span>
        <span>GOTTA CATCH 'EM ALL!</span>
      </div>
    </main>
  );
};

export default Landing;
