import { Container } from 'inversify';
import { TYPES } from './types';

// Base
import { BaseApi } from '../Data/API/BaseAPI';

// APIs
import { PersonaApi } from '../Data/API/PersonaAPI';
import { DepartamentoApi } from '../Data/API/DepartamentoAPI';

// Repositories
import { PersonaRepository } from '../Data/Repositories/PersonaRepository';
import { DepartamentoRepository } from '../Data/Repositories/DepartamentoRepository';

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
container.bind<PersonaRepository>(TYPES.PersonaRepository).to(PersonaRepository).inSingletonScope();
container.bind<DepartamentoRepository>(TYPES.DepartamentoRepository).to(DepartamentoRepository).inSingletonScope();

// Bind Use Cases
container.bind<PersonaUseCases>(TYPES.PersonaUseCases).to(PersonaUseCases);
container.bind<DepartamentoUseCases>(TYPES.DepartamentoUseCases).to(DepartamentoUseCases);

export { container };