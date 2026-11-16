
const Pokemon = require("../../models/Pokemon");

describe("Modelo Pokemon", () => {
  const validPokemon = {
    name: "Testmon",
    image: "https://example.com/testmon.png",
    hp: 80,
    attack: 90,
    defense: 70,
    speed: 85,
    height: 12,
    weight: 300,
  };

  test("El modelo debe estar definido", () => {
    expect(Pokemon).toBeDefined();
    expect(Pokemon.name).toBe("Pokemon");
  });

  test("Debe contener todos los campos requeridos", () => {
    const attributes = Pokemon.rawAttributes;

    expect(attributes.id).toBeDefined();
    expect(attributes.name).toBeDefined();
    expect(attributes.image).toBeDefined();
    expect(attributes.hp).toBeDefined();
    expect(attributes.attack).toBeDefined();
    expect(attributes.defense).toBeDefined();
    expect(attributes.speed).toBeDefined();
    expect(attributes.height).toBeDefined();
    expect(attributes.weight).toBeDefined();
  });

  test("Debe generar automáticamente un UUID", () => {
    const pokemon = Pokemon.build(validPokemon);

    expect(pokemon.id).toBeDefined();
    expect(pokemon.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });

  test("Debe validar un Pokémon con datos correctos", async () => {
    const pokemon = Pokemon.build(validPokemon);

    await expect(pokemon.validate()).resolves.toBeDefined();
  });

  test.each(["name", "image", "hp", "attack", "defense"])(
    "Debe rechazar un Pokémon sin el campo obligatorio %s",
    async (field) => {
      const pokemonData = { ...validPokemon };
      delete pokemonData[field];

      const pokemon = Pokemon.build(pokemonData);

      await expect(pokemon.validate()).rejects.toThrow();
    }
  );
});
