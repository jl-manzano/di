import { Departamento } from '../../Entities/Departamento';

export interface IDepartamentoUseCases {
  getDepartamentos(): Promise<Departamento[]>;
  addDepartamento(departamento: Departamento): Promise<Departamento>;
  updateDepartamento(departamento: Departamento): Promise<Departamento>;
  deleteDepartamento(id: number): Promise<void>;
}