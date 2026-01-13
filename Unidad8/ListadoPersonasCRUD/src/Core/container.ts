import { Container } from 'inversify';
import { TYPES } from './types';

// Base
import { BaseApi } from '../Data/API/BaseAPI';

// APIs
import { PersonaApi } from '../Data/API/PersonaAPI';
import { DepartamentoApi } from '../Data/API/DepartamentoAPI';

// Repositories
import { IPersonaRepository } from '../Domain/Interfaces/Persona/IPersonaRepository';
import { IDepartamentoRepository } from '../Domain/Interfaces/Departamento/IDepartamentoRepository';
import { PersonaRepository } from '../Data/Repositories/PersonaRepository';
import { DepartamentoRepositoryImpl } from '../Data/Repositories/DepartamentoRepository';

// Use Cases Interfaces
import { IPersonaUseCases } from '../Domain/Interfaces/Persona/IPersonaUseCases';
import { IDepartamentoUseCases } from '../Domain/Interfaces/Departamento/IDepartamentoUseCases';

// Use Cases Implementations
import { PersonaUseCases } from '../Domain/UseCases/PersonaUseCases';
import { DepartamentoUseCases } from '../Domain/UseCases/DepartamentoUseCases';

const container = new Container();

// Bind Base
container.bind<BaseApi>(TYPES.BaseApi).to(BaseApi).inSingletonScope();

// Bind APIs
container.bind<PersonaApi>(TYPES.PersonaApi).to(PersonaApi).inSingletonScope();
container.bind<DepartamentoApi>(TYPES.DepartamentoApi).to(DepartamentoApi).inSingletonScope();

// Bind Repositories
container.bind<IPersonaRepository>(TYPES.PersonaRepository).to(PersonaRepository).inSingletonScope(); // Cambié a la interfaz IPersonaRepository
container.bind<IDepartamentoRepository>(TYPES.DepartamentoRepository).to(DepartamentoRepositoryImpl).inSingletonScope(); // Cambié a la interfaz IDepartamentoRepository

// Bind Use Cases - Personas
container.bind<IPersonaUseCases>(TYPES.PersonaUseCases).to(PersonaUseCases).inSingletonScope(); // Cambié a la interfaz IPersonaUseCases

// Bind Use Cases - Departamentos
container.bind<IDepartamentoUseCases>(TYPES.DepartamentoUseCases).to(DepartamentoUseCases).inSingletonScope(); // Cambié a la interfaz IDepartamentoUseCases

export { container };
