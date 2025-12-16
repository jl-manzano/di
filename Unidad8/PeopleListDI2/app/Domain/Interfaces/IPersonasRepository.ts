import { Persona } from "../Entities/Persona";

export interface IPersonasRepository {
    getListadoCompletoPersonas(): Promise<Persona[]>;
    getPersonaPorId(id: number): Promise<Persona | undefined>;
}
