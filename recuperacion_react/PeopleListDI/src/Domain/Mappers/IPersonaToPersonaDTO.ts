import { Persona } from "../Entities/Persona";
import { PersonaDTO } from "../DTOs/PersonaDTO";

export interface IPersonaToPersonaDTO {
  map(persona: Persona): PersonaDTO;
}