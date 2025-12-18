import { makeAutoObservable, runInAction } from "mobx";
import { inject, injectable } from "inversify";
import { TYPES } from "../../Core/types";
import { IPersonasUseCases } from "../../Domain/Interfaces/IPersonasUseCases";
import { Persona } from "../../Domain/Entities/Persona";

@injectable()
export class PeopleListVM {
  private _personasList: Persona[] = [];
  private _personaSeleccionada: Persona | null = null;
  private _isLoading: boolean = false;

  constructor(
    @inject(TYPES.IPersonasUseCases) private personasUseCases: IPersonasUseCases
  ) {
    // makeAutoObservable hace que todas las propiedades sean observables
    // y todos los métodos que modifican el estado sean acciones
    makeAutoObservable(this);
  }

  get personasList(): Persona[] {
    return this._personasList;
  }

  get personaSeleccionada(): Persona | null {
    return this._personaSeleccionada;
  }

  set personaSeleccionada(value: Persona | null) {
    this._personaSeleccionada = value;
    console.log('✅ Persona seleccionada:', value?.nombre, value?.apellidos);
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  async cargarPersonas() {
    this._isLoading = true;
    try {
      const personas = await this.personasUseCases.getListadoCompleto();
      
      // runInAction asegura que la actualización del estado sea observable
      runInAction(() => {
        this._personasList = personas;
        this._isLoading = false;
      });
    } catch (error) {
      console.error("Error al cargar personas:", error);
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }
}