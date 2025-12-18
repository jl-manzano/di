import { Pokemon } from "../entities/Pokemon"

export interface IPokemonRepository {
  getAll(limit: number, offset: number): Promise<Pokemon[]>;
}