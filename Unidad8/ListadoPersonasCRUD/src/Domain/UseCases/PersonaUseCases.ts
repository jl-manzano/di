import { injectable, inject } from 'inversify';
import { IPersonaUseCases } from '../../Domain/Interfaces/Persona/IPersonaUseCases';
import { IPersonaRepository } from '../../Domain/Interfaces/Persona/IPersonaRepository';
import { PersonaDTO } from '../../Domain/DTOs/PersonaDTO';
import { Persona } from '../../Domain/Entities/Persona';
import { TYPES } from '../../Core/types';

@injectable()
export class PersonaUseCases implements IPersonaUseCases {
  constructor(
    @inject(TYPES.PersonaRepository) private personaRepository: IPersonaRepository
  ) {}

  async getPersonas(): Promise<PersonaDTO[]> {
    return await this.personaRepository.getAll();
  }

  async addPersona(persona: Persona): Promise<Persona> {
    return await this.personaRepository.create(persona);
  }

  async updatePersona(persona: Persona): Promise<Persona> {
    return await this.personaRepository.update(persona);
  }

  async deletePersona(id: number): Promise<void> {
    await this.personaRepository.delete(id);
  }
}
