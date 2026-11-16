
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchTypes, addPokemon } from "../redux/pokemonSlice";
import "../styles/CreatePokemon.css";

const initialForm = {
  name: "",
  image: "",
  hp: "",
  attack: "",
  defense: "",
  speed: "",
  height: "",
  weight: "",
  types: [],
};

const CreatePokemon = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { types, isLoading } = useSelector(
    (state) => state.pokemon
  );

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (types.length === 0) {
      dispatch(fetchTypes());
    }
  }, [dispatch, types.length]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleTypeChange = (typeName) => {
    setForm((prev) => {
      const alreadySelected = prev.types.includes(typeName);

      return {
        ...prev,
        types: alreadySelected
          ? prev.types.filter((type) => type !== typeName)
          : [...prev.types, typeName],
      };
    });

    setErrors((prev) => ({
      ...prev,
      types: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "El nombre es obligatorio.";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres.";
    }

    if (!form.image.trim()) {
      newErrors.image = "La imagen es obligatoria.";
    } else if (!/^https?:\/\/.+/i.test(form.image.trim())) {
      newErrors.image = "Ingresa una URL de imagen válida.";
    }

    const requiredStats = ["hp", "attack", "defense"];

    requiredStats.forEach((field) => {
      const value = form[field];

      if (value === "") {
        newErrors[field] = "Este campo es obligatorio.";
      } else if (!Number.isInteger(Number(value)) || Number(value) < 0) {
        newErrors[field] = "Ingresa un número entero igual o mayor a 0.";
      }
    });

    const optionalStats = ["speed", "height", "weight"];

    optionalStats.forEach((field) => {
      const value = form[field];

      if (
        value !== "" &&
        (!Number.isFinite(Number(value)) || Number(value) < 0)
      ) {
        newErrors[field] = "Ingresa un número válido igual o mayor a 0.";
      }
    });

    if (form.types.length === 0) {
      newErrors.types = "Selecciona al menos un tipo.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!validateForm()) {
      setMessage("Revisa los campos indicados antes de continuar.");
      return;
    }

    const pokemonData = {
      name: form.name.trim().toLowerCase(),
      image: form.image.trim(),
      hp: Number(form.hp),
      attack: Number(form.attack),
      defense: Number(form.defense),
      speed: form.speed === "" ? undefined : Number(form.speed),
      height: form.height === "" ? undefined : Number(form.height),
      weight: form.weight === "" ? undefined : Number(form.weight),
      types: form.types,
    };

    setSaving(true);

    try {
      await dispatch(addPokemon(pokemonData)).unwrap();

      setMessage("¡Pokémon registrado correctamente!");

      setForm(initialForm);
      setErrors({});
    } catch (error) {
      setMessage(
        typeof error === "string"
          ? error
          : error?.message || "No se pudo registrar el Pokémon."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="create-screen">
      <header className="create-header">
        <button
          className="create-back"
          onClick={() => navigate("/home")}
        >
          ← VOLVER AL POKÉDEX
        </button>

        <span>POKEWORLD / NEW POKÉMON</span>
      </header>

      <section className="create-intro">
        <span>DATABASE REGISTRATION SYSTEM</span>
        <h1>
          CREATE <strong>POKÉMON</strong>
        </h1>
        <p>
          Registra una nueva criatura y agrégala a tu colección.
        </p>
      </section>

      <form className="create-form" onSubmit={handleSubmit}>
        <div className="create-section-title">
          <span>01</span>
          <h2>INFORMACIÓN GENERAL</h2>
        </div>

        <div className="create-fields">
          <div className="create-field">
            <label htmlFor="name">NOMBRE DEL POKÉMON</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Ejemplo: mewtwo"
            />
            {errors.name && <small>{errors.name}</small>}
          </div>

          <div className="create-field">
            <label htmlFor="image">URL DE LA IMAGEN</label>
            <input
              id="image"
              name="image"
              type="text"
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
            />
            {errors.image && <small>{errors.image}</small>}
          </div>
        </div>

        {form.image.trim() && (
          <div className="create-preview">
            <span>IMAGE PREVIEW</span>
            <img
              src={form.image}
              alt="Vista previa del Pokémon"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
              onLoad={(event) => {
                event.currentTarget.style.display = "block";
              }}
            />
          </div>
        )}

        <div className="create-divider"></div>

        <div className="create-section-title">
          <span>02</span>
          <h2>ESTADÍSTICAS DEL POKÉMON</h2>
        </div>

        <div className="create-fields create-stats-grid">
          {[
            { name: "hp", label: "HP", required: true },
            { name: "attack", label: "ATAQUE", required: true },
            { name: "defense", label: "DEFENSA", required: true },
            { name: "speed", label: "VELOCIDAD", required: false },
            { name: "height", label: "ALTURA", required: false },
            { name: "weight", label: "PESO", required: false },
          ].map((field) => (
            <div className="create-field" key={field.name}>
              <label htmlFor={field.name}>
                {field.label}
                {field.required ? " *" : " (OPCIONAL)"}
              </label>

              <input
                id={field.name}
                name={field.name}
                type="number"
                value={form[field.name]}
                onChange={handleChange}
                placeholder="0"
              />

              {errors[field.name] && (
                <small>{errors[field.name]}</small>
              )}
            </div>
          ))}
        </div>

        <div className="create-divider"></div>

        <div className="create-section-title">
          <span>03</span>
          <h2>SELECCIONAR TIPOS</h2>
        </div>

        <p className="create-hint">
          Puedes seleccionar uno o varios tipos para tu Pokémon.
        </p>

        <div className="create-types">
          {types.map((type) => {
            const selected = form.types.includes(type.name);

            return (
              <button
                type="button"
                key={type.id}
                className={`create-type ${selected ? "selected" : ""}`}
                onClick={() => handleTypeChange(type.name)}
              >
                {selected && <span>✓ </span>}
                {type.name}
              </button>
            );
          })}
        </div>

        {errors.types && <small className="create-type-error">{errors.types}</small>}

        {message && (
          <div className={`create-message ${message.startsWith("¡") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <div className="create-actions">
          <button
            type="button"
            className="create-cancel"
            onClick={() => navigate("/home")}
          >
            CANCELAR
          </button>

          <button
            type="submit"
            className="create-submit"
            disabled={saving || isLoading}
          >
            {saving ? "REGISTRANDO..." : "REGISTRAR POKÉMON"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreatePokemon;
