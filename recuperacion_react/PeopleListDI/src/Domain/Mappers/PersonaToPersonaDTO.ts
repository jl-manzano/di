import { injectable } from "inversify";
import { IPersonaToPersonaDTO } from "./IPersonaToPersonaDTO";
import { Persona } from "../Entities/Persona";
import { PersonaDTO } from "../DTOs/PersonaDTO";

@injectable()
export class PersonaToPersonaDTO implements IPersonaToPersonaDTO {
  map(persona: Persona): PersonaDTO {
    return new PersonaDTO(
      persona.id,
      persona.nombre,
      persona.apellidos,
      persona.idDepartamento
    );
  }
}