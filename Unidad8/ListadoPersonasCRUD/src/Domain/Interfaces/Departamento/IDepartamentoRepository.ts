import { Departamento } from '../../Entities/Departamento';

export interface IDepartamentoRepository {
  getAll(): Promise<Departamento[]>;
  getById(id: number): Promise<Departamento | null>;
  create(departamento: Departamento): Promise<Departamento>;
  update(departamento: Departamento): Promise<Departamento>;
  delete(id: number): Promise<void>;
}