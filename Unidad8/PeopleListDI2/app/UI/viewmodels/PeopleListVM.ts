import { makeAutoObservable } from "mobx";
import { inject, injectable } from "inversify";
import { TYPES } from "../../Core/types";
import { IPersonasUseCases } from "../../Domain/Interfaces/IPersonasUseCases";
import { Persona } from "../../Domain/Entities/Persona";

@injectable()
export class PeopleListVM {

  private _personasList: Persona[] = [];
  private _personaSeleccionada: Persona;
  private isLoading: boolean = false;

  constructor(
    @inject(TYPES.IPersonasUseCases)
    private personasUseCases: IPersonasUseCases
  ) {
    this._personaSeleccionada = new Persona(0, "Selecciona", "una persona");
    makeAutoObservable(this);
  }

  get personasList(): Persona[] {
    return this._personasList;
  }

  get personaSeleccionada(): Persona {
    return this._personaSeleccionada;
  }

  set personaSeleccionada(value: Persona) {
    this._personaSeleccionada = value;
  }

  async cargarPersonas() {
    this.isLoading = true;
    try {
      const personas = await this.personasUseCases.getListadoCompleto();
      this._personasList = personas;
    } catch (error) {
      console.error("Error al cargar personas:", error);
    } finally {
      this.isLoading = false;
    }
  }
}
