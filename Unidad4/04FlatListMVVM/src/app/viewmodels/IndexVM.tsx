import { RepositoryPersonas } from '../models/data/RepositoryPersona';
import { Persona } from '../models/entities/PersonaModel';

export class IndexVM {
    private _personas: Persona[];
    private _personaSeleccionada: Persona | undefined;


    constructor() {
        this._personas = RepositoryPersonas.getPersonas();
    }

    public set personaSeleccionada(item: Persona | undefined) {
        this._personaSeleccionada = item;
        this.alertPersonaSeleccionada();
    }

    private alertPersonaSeleccionada() {
        alert(`${this._personaSeleccionada?.nombre} ${this._personaSeleccionada?.apellidos}`);

    }

    public get Personas() {
        return this._personas;
    }
}
