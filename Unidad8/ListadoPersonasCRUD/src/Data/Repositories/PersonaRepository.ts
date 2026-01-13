import { injectable, inject } from 'inversify';
import { IPersonaRepository } from '../../Domain/Interfaces/Persona/IPersonaRepository';
import { Persona } from '../../Domain/Entities/Persona';
import { PersonaDTO } from '../../Domain/DTOs/PersonaDTO';
import { PersonaApi } from '../API/PersonaAPI';
import { TYPES } from '../../Core/types';

@injectable()
export class PersonaRepository implements IPersonaRepository {
  constructor(
    @inject(TYPES.PersonaApi) private api: PersonaApi
  ) {}

  async getAll(): Promise<PersonaDTO[]> {
    return await this.api.getAll();
  }

  async getById(id: number): Promise<PersonaDTO | null> {
    return await this.api.getById(id);
  }

  async create(persona: Persona): Promise<Persona> {
    return await this.api.create(persona);
  }

  async update(persona: Persona): Promise<Persona> {
    return await this.api.update(persona);
  }

  async delete(id: number): Promise<void> {
    await this.api.delete(id);
  }
}