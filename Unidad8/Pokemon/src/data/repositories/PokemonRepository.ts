// data/repositories/PokemonRepository.ts
import { IPokemonRepository } from "../../domain/interfaces/IPokemonRepository";
import { PokemonDTO, PokemonResponseDTO } from "../dtos/PokemonDTO";
import { PokemonMapper } from "../mapper/PokemonMapper";
import { Pokemon } from "../../domain/entities/Pokemon";

export class PokemonRepository implements IPokemonRepository {
  private baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  async getAll(limit: number, offset: number): Promise<Pokemon[]> {
    const url = `${this.baseUrl}?limit=${limit}&offset=${offset}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error al cargar los Pokémon');
    }

    const data = await response.json();

    // Mapear directamente el DTO como un objeto, no usar 'new' para instanciar
    const responseDTO: PokemonResponseDTO = {
      count: data.count,
      next: data.next,
      previous: data.previous,
      results: data.results.map((r: any) => ({
        name: r.name,
        url: r.url,
      })),
    };

    // Convertir los DTO a entidades de Pokemon
    return responseDTO.results.map(dto => PokemonMapper.mapToEntity(dto));
  }
}
