import { Persona } from "../Entities/Persona";

export interface IPersonasUseCases {
    getListadoCompleto(): Promise<Persona[]>;
    getListadoFiltradoPorNombre(nombre: string): Promise<Persona[]>;
}
