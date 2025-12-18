// vm/PokemonViewModel.ts
import { makeAutoObservable } from "mobx";
import { injectable, inject } from "inversify";
import { TYPES } from "../core/types";
import { IPokemonUseCases } from "../domain/interfaces/IPokemonUseCases";
import { Pokemon } from "../domain/entities/Pokemon";

@injectable()
export class PokemonViewModel {
  private useCases: IPokemonUseCases;
  private _listadoPokemons: Pokemon[] = [];
  private _offset: number = 0;
  private _isLoading: boolean = false;
  private listeners: (() => void)[] = [];
  private _pokemonSeleccionada: Pokemon | null = null;

  constructor(
    @inject(TYPES.IPokemonUseCases) useCases: IPokemonUseCases
  ) {
    this.useCases = useCases;
    makeAutoObservable(this);
  }

  get listadoPokemons(): Pokemon[] {
    return this._listadoPokemons;
  }

  get pokemonSeleccionada(): Pokemon | null {
    return this._pokemonSeleccionada;
  }

  set pokemonSeleccionada(value: Pokemon | null) {
    this._pokemonSeleccionada = value;
  }

  get offset(): number {
    return this._offset;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  async loadMorePokemons() {
    if (this._isLoading) return;

    this._isLoading = true;
    this.notify();

    try {
      // Carga los siguientes 20 pokémon y REEMPLAZA la lista completa
      const pokemons = await this.useCases.execute(20, this._offset);
      this._listadoPokemons = pokemons; // Reemplaza en lugar de agregar
      this._offset += 20;
    } catch (error) {
      console.error("Error loading pokemons:", error);
    } finally {
      this._isLoading = false;
      this.notify();
    }
  }
}