import { injectable, inject } from 'inversify';
import { IPersonaRepository } from '../../Domain/Interfaces/Persona/IPersonaRepository';
import { PersonaDTO } from '../../Domain/DTOs/PersonaDTO';
import { Persona } from '../../Domain/Entities/Persona';
import { PersonaApi } from '../API/PersonaAPI';
import { TYPES } from '../../Core/types';

@injectable()
export class PersonaRepository implements IPersonaRepository {
  constructor(
    @inject(TYPES.PersonaApi) private personaApi: PersonaApi
  ) {}

  getAll(): Promise<PersonaDTO[]> {
    return this.personaApi.getAll();
  }

  getById(id: number): Promise<PersonaDTO | null> {
    return this.personaApi.getById(id);
  }

  create(persona: Persona): Promise<Persona> {
    return this.personaApi.create(persona);
  }

  update(persona: Persona): Promise<Persona> {
    return this.personaApi.update(persona);
  }

  delete(id: number): Promise<void> {
    return this.personaApi.delete(id);
  }
}