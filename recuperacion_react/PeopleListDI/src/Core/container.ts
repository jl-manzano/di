// Core/container.ts
import { Container } from "inversify";
import "reflect-metadata";
import { TYPES } from "./types";

// Base
import { BaseApi } from "./BaseApi";

// Repositories
import { PersonasRepository } from "../Data/Repositories/PersonasRepository";
import { DepartamentosRepository } from "../Data/Repositories/DepartamentosRepository";
import { IPersonasRepository } from "../Domain/Interfaces/Persona/IPersonasRepository";
import { IDepartamentosRepository } from "../Domain/Interfaces/Departamento/IDepartamentosRepository";

// UseCases
import { PersonasUseCases } from "../Domain/UseCases/PersonasUseCases";
import { DepartamentosUseCases } from "../Domain/UseCases/DepartamentosUseCases";
import { IPersonasUseCases } from "../Domain/Interfaces/Persona/IPersonasUseCases";
import { IDepartamentosUseCases } from "../Domain/Interfaces/Departamento/IDepartamentosUseCases";

// Mappers Domain
import { PersonaToPersonaDTO } from "../Domain/Mappers/PersonaToPersonaDTO";
import { IPersonaToPersonaDTO } from "../Domain/Mappers/IPersonaToPersonaDTO";

// Mappers UI
import { DomainToUI } from "../UI/Mappers/DomainToUI";
import { IDomainToUI } from "../UI/Mappers/IDomainToUI";

// ViewModels
import { JuegoVM } from "../UI/ViewModels/JuegoVM";

const container = new Container();

// Bind Base
container.bind<BaseApi>(TYPES.BaseApi).to(BaseApi).inSingletonScope();

// Bind Repositories
container
  .bind<IPersonasRepository>(TYPES.IPersonasRepository)
  .to(PersonasRepository);

container
  .bind<IDepartamentosRepository>(TYPES.IDepartamentosRepository)
  .to(DepartamentosRepository);

// Bind UseCases
container
  .bind<IPersonasUseCases>(TYPES.IPersonasUseCases)
  .to(PersonasUseCases);

container
  .bind<IDepartamentosUseCases>(TYPES.IDepartamentosUseCases)
  .to(DepartamentosUseCases);

// Bind Mappers Domain
container
  .bind<IPersonaToPersonaDTO>(TYPES.IPersonaToPersonaDTO)
  .to(PersonaToPersonaDTO);

// Bind Mappers UI
container.bind<IDomainToUI>(TYPES.IDomainToUI).to(DomainToUI);

// Bind ViewModels
container.bind<JuegoVM>(TYPES.JuegoVM).to(JuegoVM);

export { container };