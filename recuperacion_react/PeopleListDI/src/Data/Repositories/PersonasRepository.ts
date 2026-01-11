// Data/Repositories/PersonasRepository.ts
import { injectable, inject } from "inversify";
import { TYPES } from "../../Core/types";
import { IPersonasRepository } from "../../Domain/Interfaces/Persona/IPersonasRepository";
import { Persona } from "../../Domain/Entities/Persona";
import { BaseApi } from "../../Core/BaseApi";

@injectable()
export class PersonasRepository implements IPersonasRepository {
  constructor(@inject(TYPES.BaseApi) private baseApi: BaseApi) {}

  async getListadoCompletoPersonas(): Promise<Persona[]> {
    try {
      const url = this.baseApi.getBaseUrl("/api/Personas");
      console.log("🌐 GET Personas:", url);

      const response = await fetch(url, {
        headers: this.baseApi.getDefaultHeaders(),
      });

      if (!response.ok) {
        throw new Error(
          `Error al obtener personas: ${response.status} ${response.statusText}`
        );
      }

      const personasData = await response.json();

      return personasData.map(
        (data: {
          id: number;
          nombre: string;
          apellidos: string;
          fechaNac: string;
          direccion: string;
          telefono: string;
          foto: string;
          idDepartamento: number;
        }) =>
          new Persona(
            data.id,
            data.nombre,
            data.apellidos,
            new Date(data.fechaNac),
            data.direccion,
            data.telefono,
            data.foto,
            data.idDepartamento
          )
      );
    } catch (error) {
      console.error("❌ Error obteniendo personas:", error);
      return [];
    }
  }
}