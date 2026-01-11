import { PersonaDTO } from "./PersonaDTO";
import { Departamento } from "../Entities/Departamento";

export class PersonaConListadoDepartamento {
  constructor(
    public readonly persona: PersonaDTO,
    public readonly listadoDepartamentos: Departamento[]
  ) {}
}