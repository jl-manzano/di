import { Persona } from "../Entities/Persona";

export interface IRepositoryPersonas {
    getListadoCompletoPersonas(): Promise<Persona[]>; // Método asíncrono
}
