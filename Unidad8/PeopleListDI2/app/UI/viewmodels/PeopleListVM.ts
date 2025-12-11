import { inject } from "inversify";
import { TYPES } from "../../Core/types";
import { IRepositoryPersonas } from "../../Domain/Interfaces/IRepositoryPersonas";
import { makeAutoObservable } from "mobx";
import { Persona } from "../../Domain/Entities/Persona";

export class PeopleListVM {
    private _personasList: Persona[] = [];
    private _personaSeleccionada: Persona;

    constructor(
        @inject(TYPES.IRepositoryPersonas)
        private RepositoryPersonas: IRepositoryPersonas
    ) {
        this._personaSeleccionada = new Persona(0, 'Sofyan', 'Amrabat');
        this.loadPersonas(); // Cargar las personas de manera asíncrona
    }

    // Cargar personas
    private async loadPersonas() {
        this._personasList = await this.RepositoryPersonas.getListadoCompletoPersonas();
        makeAutoObservable(this); // Hacemos que mobx observe este objeto
    }

    public get personasList(): Persona[] {
        return this._personasList;
    }

    public get personaSeleccionada(): Persona {
        return this._personaSeleccionada;
    }

    public set personaSeleccionada(value: Persona) {
        this._personaSeleccionada = value;
    }
}
