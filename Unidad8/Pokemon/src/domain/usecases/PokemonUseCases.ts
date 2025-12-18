// domain/usecases/PokemonUseCases.ts
import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";
import { IPokemonRepository } from "../interfaces/IPokemonRepository";
import { IPokemonUseCases } from "../interfaces/IPokemonUseCases";
import { Pokemon } from "../entities/Pokemon";

@injectable()
export class PokemonUseCases implements IPokemonUseCases {
  private pokemonRepository: IPokemonRepository;

  constructor(
    @inject(TYPES.IPokemonRepository) pokemonRepository: IPokemonRepository
  ) {
    this.pokemonRepository = pokemonRepository;
  }

  async execute(limit: number, offset: number): Promise<Pokemon[]> {
    return await this.pokemonRepository.getAll(limit, offset);
  }
}
