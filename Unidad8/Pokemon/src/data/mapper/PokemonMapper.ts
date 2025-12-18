// data/mapper/PokemonMapper.ts
import { Pokemon } from "../../domain/entities/Pokemon";
import { PokemonDTO } from "../dtos/PokemonDTO";

export class PokemonMapper {
  static mapToEntity(dto: PokemonDTO): Pokemon {
    const id = this.extractIdFromUrl(dto.url);
    return new Pokemon(id, dto.name, dto.url);
  }

  private static extractIdFromUrl(url: string): string {
    const parts = url.split('/').filter(part => part !== '');
    return parts[parts.length - 1];
  }
}
