import { Departamento } from "../../Entities/Departamento";

export interface IDepartamentosRepository {
  getListadoDepartamentos(): Promise<Departamento[]>;
}