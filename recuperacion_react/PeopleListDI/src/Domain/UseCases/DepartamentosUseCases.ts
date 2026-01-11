import { injectable, inject } from "inversify";
import { TYPES } from "../../Core/types";
import { IDepartamentosRepository } from "../Interfaces/Departamento/IDepartamentosRepository";
import { IDepartamentosUseCases } from "../Interfaces/Departamento/IDepartamentosUseCases";
import { Departamento } from "../Entities/Departamento";

@injectable()
export class DepartamentosUseCases implements IDepartamentosUseCases {
  constructor(
    @inject(TYPES.IDepartamentosRepository)
    private departamentosRepository: IDepartamentosRepository
  ) {}

  async getDepartamentos(): Promise<Departamento[]> {
    return await this.departamentosRepository.getListadoDepartamentos();
  }
}