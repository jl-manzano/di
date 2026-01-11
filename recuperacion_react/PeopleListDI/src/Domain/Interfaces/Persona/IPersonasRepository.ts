import { Persona } from "../../Entities/Persona";

export interface IPersonasRepository {
  getListadoCompletoPersonas(): Promise<Persona[]>;
}