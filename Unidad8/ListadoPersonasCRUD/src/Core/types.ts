export const TYPES = {
  // Base
  BaseApi: Symbol.for('BaseApi'),
  
  // APIs
  PersonaApi: Symbol.for('PersonaApi'),
  DepartamentoApi: Symbol.for('DepartamentoApi'),
  
  // Repositories
  PersonaRepository: Symbol.for('IPersonaRepository'),  // Interfaz IPersonaRepository
  DepartamentoRepository: Symbol.for('IDepartamentoRepository'),  // Interfaz IDepartamentoRepository
  
  // Use Cases - Personas
  PersonaUseCases: Symbol.for('IPersonaUseCases'),  // Interfaz IPersonaUseCases
  
  // Use Cases - Departamentos
  DepartamentoUseCases: Symbol.for('IDepartamentoUseCases'),  // Interfaz IDepartamentoUseCases
};
