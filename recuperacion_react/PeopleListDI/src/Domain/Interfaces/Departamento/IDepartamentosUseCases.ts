import { Departamento } from "../../Entities/Departamento";

export interface IDepartamentosUseCases {
  getDepartamentos(): Promise<Departamento[]>;
}