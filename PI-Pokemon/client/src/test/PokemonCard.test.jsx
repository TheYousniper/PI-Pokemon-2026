
import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PokemonCard from "../components/PokemonCard";

const mockPokemon = {
  id: 6,
  name: "Charizard",
  image: "https://example.com/charizard.png",
  hp: 78,
  attack: 84,
  defense: 78,
  types: ["fire", "flying"],
  origin: "API",
};

describe("Componente PokemonCard", () => {
  test("Debe mostrar el nombre del Pokémon", () => {
    render(
      <PokemonCard pokemon={mockPokemon} onSelect={vi.fn()} />
    );

    expect(
      screen.getByRole("heading", { name: "Charizard" })
    ).toBeInTheDocument();
  });

  test("Debe mostrar correctamente sus tipos", () => {
    render(
      <PokemonCard pokemon={mockPokemon} onSelect={vi.fn()} />
    );

    expect(screen.getByText("FIRE")).toBeInTheDocument();
    expect(screen.getByText("FLYING")).toBeInTheDocument();
  });

 test("Debe mostrar sus estadísticas", () => {
  render(
    <PokemonCard pokemon={mockPokemon} onSelect={vi.fn()} />
  );

  expect(screen.getAllByText("78")).toHaveLength(2);
  expect(screen.getByText("84")).toBeInTheDocument();

  expect(screen.getByText("HP")).toBeInTheDocument();
  expect(screen.getByText("ATTACK")).toBeInTheDocument();
  expect(screen.getByText("DEFENSE")).toBeInTheDocument();
});

  test("Debe identificar un Pokémon de la base de datos", () => {
    const databasePokemon = {
      ...mockPokemon,
      id: "550e8400-e29b-41d4-a716-446655440000",
      origin: "DB",
      types: [{ name: "electric" }],
    };

    render(
      <PokemonCard
        pokemon={databasePokemon}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByText("DB")).toBeInTheDocument();
    expect(screen.getByText("DATABASE")).toBeInTheDocument();
    expect(screen.getByText("ELECTRIC")).toBeInTheDocument();
  });

  test("Debe ejecutar onSelect al hacer clic", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <PokemonCard pokemon={mockPokemon} onSelect={onSelect} />
    );

    await user.click(screen.getByRole("button"));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(6);
  });

  test("Debe ejecutar onSelect al presionar Enter", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <PokemonCard pokemon={mockPokemon} onSelect={onSelect} />
    );

    screen.getByRole("button").focus();
    await user.keyboard("{Enter}");

    expect(onSelect).toHaveBeenCalledWith(6);
  });
});
