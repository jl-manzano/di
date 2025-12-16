// src/Domain/Usecases/PersonasRepositoryUseCase.ts
import { injectable, inject } from "inversify";
import { TYPES } from "../../Core/types";
import { IPersonasRepository } from "../Interfaces/IPersonasRepository";
import { IPersonasUseCases } from "../Interfaces/IPersonasUseCases";
import { Persona } from "../Entities/Persona";

@injectable()
export class PersonasUseCases implements IPersonasUseCases {
    private personasRepository: IPersonasRepository;

    constructor(
        @inject(TYPES.IPersonasRepository) personasRepository: IPersonasRepository
    ) {
        this.personasRepository = personasRepository;
    }

    // Obtiene todas las personas a través del repositorio
    async getListadoCompleto(): Promise<Persona[]> {
        return await this.personasRepository.getListadoCompletoPersonas();
    }

    // Filtra las personas por nombre
    async getListadoFiltradoPorNombre(nombre: string): Promise<Persona[]> {
        const listado = await this.personasRepository.getListadoCompletoPersonas();
        return listado.filter(p =>
            p.nombre.toLowerCase().includes(nombre.toLowerCase())
        );
    }
}
