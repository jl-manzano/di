// Core/types.ts
export const TYPES = {
  // Base
  BaseApi: Symbol.for("BaseApi"),
  
  // Repositories
  IPersonasRepository: Symbol.for("IPersonasRepository"),
  IDepartamentosRepository: Symbol.for("IDepartamentosRepository"),
  
  // UseCases
  IPersonasUseCases: Symbol.for("IPersonasUseCases"),
  IDepartamentosUseCases: Symbol.for("IDepartamentosUseCases"),
  
  // Mappers Domain
  IPersonaToPersonaDTO: Symbol.for("IPersonaToPersonaDTO"),
  
  // Mappers UI
  IDomainToUI: Symbol.for("IDomainToUI"),
  
  // ViewModels
  JuegoVM: Symbol.for("JuegoVM"),
};