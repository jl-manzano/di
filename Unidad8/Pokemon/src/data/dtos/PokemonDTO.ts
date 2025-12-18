// data/dtos/PokemonDTO.ts
export interface PokemonDTO {
  name: string;
  url: string;
}

export interface PokemonResponseDTO {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonDTO[];
}
