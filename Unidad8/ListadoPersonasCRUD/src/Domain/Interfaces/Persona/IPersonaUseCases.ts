import { PersonaDTO } from '../../DTOs/PersonaDTO';
import { Persona } from '../../Entities/Persona';

export interface IPersonaUseCases {
  getPersonas(): Promise<PersonaDTO[]>;
  addPersona(persona: Persona): Promise<Persona>;
  updatePersona(persona: Persona): Promise<Persona>;
  deletePersona(id: number): Promise<void>;
}
