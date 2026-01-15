import { injectable, inject } from 'inversify';
import { IDepartamentoRepository } from '../../Domain/Interfaces/Departamento/IDepartamentoRepository';
import { Departamento } from '../../Domain/Entities/Departamento';
import { DepartamentoApi } from '../API/DepartamentoAPI';
import { TYPES } from '../../Core/types';

@injectable()
export class DepartamentoRepository implements IDepartamentoRepository {
  constructor(
    @inject(TYPES.DepartamentoApi) private api: DepartamentoApi
  ) {}

  async getAll(): Promise<Departamento[]> {
    return await this.api.getAll();
  }

  async getById(id: number): Promise<Departamento | null> {
    return await this.api.getById(id);
  }

  async create(departamento: Departamento): Promise<Departamento> {
    return await this.api.create(departamento);
  }

  async update(departamento: Departamento): Promise<Departamento> {
    return await this.api.update(departamento);
  }

  async delete(id: number): Promise<void> {
    await this.api.delete(id);
  }
}