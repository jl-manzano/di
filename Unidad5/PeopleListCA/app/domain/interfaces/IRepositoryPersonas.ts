import { Persona } from "../entities/Persona";

// interfaz IRepositoryPersonas
export interface IRepositoryPersonas {
    getListadoCompletoPersonas(): Persona[]; // método para obtener la lista completa de personas
}