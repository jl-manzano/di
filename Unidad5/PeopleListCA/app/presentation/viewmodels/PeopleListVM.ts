import { inject } from "inversify";
import { Persona } from "../../domain/entities/Persona";
import { TYPES } from "../../core/types";
import { GetPeopleListUC } from "../../domain/usecases/GetPeopleListUC";

export class PeopleListVM {
    private _personasList: Persona[] = [];
    private _personaSeleccionada: Persona;

    constructor(
        @inject(TYPES.GetPeopleListUC)
        private getPeopleListUseCase: GetPeopleListUC
    ) {
        this._personaSeleccionada = new Persona(0, '', '');
        this._personasList = this.getPeopleListUseCase.execute();
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
