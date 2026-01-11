// Data/Repositories/DepartamentosRepository.ts
import { injectable, inject } from "inversify";
import { TYPES } from "../../Core/types";
import { IDepartamentosRepository } from "../../Domain/Interfaces/Departamento/IDepartamentosRepository";
import { Departamento } from "../../Domain/Entities/Departamento";
import { BaseApi } from "../../Core/BaseApi";

@injectable()
export class DepartamentosRepository implements IDepartamentosRepository {
  constructor(@inject(TYPES.BaseApi) private baseApi: BaseApi) {}

  async getListadoDepartamentos(): Promise<Departamento[]> {
    try {
      const url = this.baseApi.getBaseUrl("/api/Departamentos");
      console.log("🌐 GET Departamentos:", url);

      const response = await fetch(url, {
        headers: this.baseApi.getDefaultHeaders(),
      });

      if (!response.ok) {
        throw new Error(
          `Error al obtener departamentos: ${response.status} ${response.statusText}`
        );
      }

      const departamentosData = await response.json();

      const departamentos = departamentosData.map((data: any) => {
        const id = 
          data.id ?? 
          data.ID ?? 
          data.Id ?? 
          data.idDepartamento ?? 
          data.IdDepartamento;
        const nombre =
          data.nombre ?? 
          data.Nombre ?? 
          data.nombreDepartamento ?? 
          data.NombreDepartamento;

        return new Departamento(id, nombre);
      });

      return departamentos;
    } catch (error) {
      console.error("❌ Error obteniendo departamentos:", error);
      return [];
    }
  }
}