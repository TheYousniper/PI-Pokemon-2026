
const { Op } = require("sequelize");
const sequelize = require("../config/db");
const { Pokemon, Type } = require("../models");

const createPokemon = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      name,
      image,
      hp,
      attack,
      defense,
      speed,
      height,
      weight,
      types,
    } = req.body;

    // 1. Validar campos obligatorios
    if (
      !name ||
      !name.trim() ||
      !image ||
      !image.trim() ||
      hp === undefined ||
      attack === undefined ||
      defense === undefined ||
      !Array.isArray(types) ||
      types.length === 0
    ) {
      await transaction.rollback();

      return res.status(400).json({
        error: "Debes proporcionar nombre, imagen, hp, attack, defense y al menos un tipo",
      });
    }

    // 2. Validar que las estadísticas sean números enteros no negativos
    const requiredStats = { hp, attack, defense };
    const optionalStats = { speed, height, weight };

    for (const [stat, value] of Object.entries(requiredStats)) {
      if (!Number.isInteger(value) || value < 0) {
        await transaction.rollback();

        return res.status(400).json({
          error: `La estadística ${stat} debe ser un número entero no negativo`,
        });
      }
    }

    for (const [stat, value] of Object.entries(optionalStats)) {
      if (
        value !== undefined &&
        value !== null &&
        (!Number.isInteger(value) || value < 0)
      ) {
        await transaction.rollback();

        return res.status(400).json({
          error: `La estadística ${stat} debe ser un número entero no negativo`,
        });
      }
    }

    // 3. Normalizar el nombre y los tipos
    const pokemonName = name.trim();
    const normalizedTypes = [
      ...new Set(
        types.map((type) =>
          typeof type === "string" ? type.trim().toLowerCase() : ""
        )
      ),
    ];

    if (normalizedTypes.some((type) => !type)) {
      await transaction.rollback();

      return res.status(400).json({
        error: "Todos los tipos deben ser nombres de texto válidos",
      });
    }

    // 4. Comprobar que el Pokémon no exista en PostgreSQL
    const existingPokemon = await Pokemon.findOne({
      where: {
        name: {
          [Op.iLike]: pokemonName,
        },
      },
      transaction,
    });

    if (existingPokemon) {
      await transaction.rollback();

      return res.status(409).json({
        error: `Ya existe un Pokémon llamado "${pokemonName}" en la base de datos`,
      });
    }

    // 5. Buscar los tipos en PostgreSQL
    const pokemonTypes = await Type.findAll({
      where: {
        name: {
          [Op.in]: normalizedTypes,
        },
      },
      transaction,
    });

    if (pokemonTypes.length !== normalizedTypes.length) {
      const foundTypes = pokemonTypes.map((type) => type.name);
      const missingTypes = normalizedTypes.filter(
        (type) => !foundTypes.includes(type)
      );

      await transaction.rollback();

      return res.status(400).json({
        error: "Uno o varios tipos no existen en la base de datos",
        invalidTypes: missingTypes,
      });
    }

    // 6. Crear el Pokémon
    const newPokemon = await Pokemon.create(
      {
        name: pokemonName,
        image: image.trim(),
        hp,
        attack,
        defense,
        speed: speed ?? null,
        height: height ?? null,
        weight: weight ?? null,
      },
      { transaction }
    );

    // 7. Asociar los tipos al Pokémon
    await newPokemon.setTypes(pokemonTypes, { transaction });

    // 8. Confirmar la transacción
    await transaction.commit();

    // 9. Devolver el Pokémon creado
    return res.status(201).json({
      id: newPokemon.id,
      name: newPokemon.name,
      image: newPokemon.image,
      hp: newPokemon.hp,
      attack: newPokemon.attack,
      defense: newPokemon.defense,
      speed: newPokemon.speed,
      height: newPokemon.height,
      weight: newPokemon.weight,
      types: pokemonTypes.map((type) => type.name),
      origin: "DB",
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        error: "Ya existe un Pokémon con ese nombre",
      });
    }

    return res.status(500).json({
      error: "Error al crear el Pokémon",
      details: error.message,
    });
  }
};

module.exports = {
  createPokemon,
};
