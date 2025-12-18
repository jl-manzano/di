import { Pokemon } from "../entities/Pokemon"

export interface IPokemonUseCases {
  execute(limit: number, offset: number): Promise<Pokemon[]>;
}