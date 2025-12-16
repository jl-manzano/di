// src/Data/Repositories/PersonasRepositoryEmpty.ts
import { injectable } from "inversify";
import { IPersonasRepository } from "../Domain/Interfaces/IPersonasRepository";
import { Persona } from "../Domain/Entities/Persona";

@injectable()
export class PersonasRepositoryEmpty implements IPersonasRepository {
    getListadoCompletoPersonas(): Promise<Persona[]> {
        // Devuelve un array vacío de personas
        return new Promise((resolve) => {
            resolve([]);
        });
    }

    getPersonaPorId(id: number): Promise<Persona | undefined> {
        // Retorna undefined ya que no hay personas en el repositorio vacío
        return new Promise((resolve) => {
            resolve(undefined);
        });
    }
}
