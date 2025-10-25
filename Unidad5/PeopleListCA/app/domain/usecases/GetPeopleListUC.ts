import { inject, injectable } from "inversify";
import { IRepositoryPersonas } from "../interfaces/IRepositoryPersonas";
import { Persona } from "../entities/Persona";
import { TYPES } from "../../core/types";

@injectable()
export class GetPeopleListUC {

    constructor(
        @inject(TYPES.IRepositoryPersonas) private repositoryPersonas: IRepositoryPersonas
    ) {}

    execute(): Persona[] {
        return this.repositoryPersonas.getListadoCompletoPersonas();
    }
}
