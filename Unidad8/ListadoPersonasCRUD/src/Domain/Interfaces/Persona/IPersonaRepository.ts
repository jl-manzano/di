import { Persona } from '../../Entities/Persona';
import { PersonaDTO } from '../../DTOs/PersonaDTO';

export interface IPersonaRepository {
  getAll(): Promise<PersonaDTO[]>;
  getById(id: number): Promise<PersonaDTO | null>;
  create(persona: Persona): Promise<Persona>;
  update(persona: Persona): Promise<Persona>;
  delete(id: number): Promise<void>;
}