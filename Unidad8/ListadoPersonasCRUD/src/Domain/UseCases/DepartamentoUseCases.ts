import { injectable, inject } from 'inversify';
import { IDepartamentoUseCases } from '../../Domain/Interfaces/Departamento/IDepartamentoUseCases';
import { IDepartamentoRepository } from '../../Domain/Interfaces/Departamento/IDepartamentoRepository';
import { Departamento } from '../../Domain/Entities/Departamento';
import { TYPES } from '../../Core/types';

@injectable()
export class DepartamentoUseCases implements IDepartamentoUseCases {
  constructor(
    @inject(TYPES.DepartamentoRepository) private departamentoRepository: IDepartamentoRepository
  ) {}

  async getDepartamentos(): Promise<Departamento[]> {
    return await this.departamentoRepository.getAll();
  }

  async addDepartamento(departamento: Departamento): Promise<Departamento> {
    return await this.departamentoRepository.create(departamento);
  }

  async updateDepartamento(departamento: Departamento): Promise<Departamento> {
    return await this.departamentoRepository.update(departamento);
  }

  async deleteDepartamento(id: number): Promise<void> {
    await this.departamentoRepository.delete(id);
  }
}
