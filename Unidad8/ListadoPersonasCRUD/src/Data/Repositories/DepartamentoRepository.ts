import { injectable, inject } from 'inversify';
import { IDepartamentoRepository } from '../../Domain/Interfaces/Departamento/IDepartamentoRepository';
import { Departamento } from '../../Domain/Entities/Departamento';
import { DepartamentoApi } from '../API/DepartamentoAPI';
import { TYPES } from '../../Core/types';

@injectable()
export class DepartamentoRepository implements IDepartamentoRepository {
  constructor(
    @inject(TYPES.DepartamentoApi) private departamentoApi: DepartamentoApi
  ) {}

  getAll(): Promise<Departamento[]> {
    return this.departamentoApi.getAll();
  }

  getById(id: number): Promise<Departamento | null> {
    return this.departamentoApi.getById(id);
  }

  create(departamento: Departamento): Promise<Departamento> {
    return this.departamentoApi.create(departamento);
  }

  update(departamento: Departamento): Promise<Departamento> {
    return this.departamentoApi.update(departamento);
  }

  delete(id: number): Promise<void> {
    return this.departamentoApi.delete(id);
  }
}