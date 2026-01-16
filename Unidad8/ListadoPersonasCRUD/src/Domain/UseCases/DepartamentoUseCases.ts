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

  getDepartamentos(): Promise<Departamento[]> {
    return this.departamentoRepository.getAll();
  }

  addDepartamento(departamento: Departamento): Promise<Departamento> {
    return this.departamentoRepository.create(departamento);
  }

  updateDepartamento(departamento: Departamento): Promise<Departamento> {
    return this.departamentoRepository.update(departamento);
  }

  deleteDepartamento(id: number): Promise<void> {
    return this.departamentoRepository.delete(id);
  }
}