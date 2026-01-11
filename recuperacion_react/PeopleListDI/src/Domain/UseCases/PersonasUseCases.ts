import { injectable, inject } from "inversify";
import { TYPES } from "../../Core/types";
import { IPersonasRepository } from "../Interfaces/Persona/IPersonasRepository";
import { IPersonasUseCases } from "../Interfaces/Persona/IPersonasUseCases";
import { IDepartamentosUseCases } from "../Interfaces/Departamento/IDepartamentosUseCases";
import { IPersonaToPersonaDTO } from "../Mappers/IPersonaToPersonaDTO";
import { PersonaConListadoDepartamento } from "../DTOs/PersonaConListadoDepartamento";
import { PersonaConDepartamentoSeleccionado } from "../DTOs/PersonaConDepartamentoSeleccionado";
import { Persona } from "../Entities/Persona";
import { Departamento } from "../Entities/Departamento";
import { PersonaDTO } from "../DTOs/PersonaDTO";

@injectable()
export class PersonasUseCases implements IPersonasUseCases {
  constructor(
    @inject(TYPES.IPersonasRepository)
    private personasRepository: IPersonasRepository,
    @inject(TYPES.IDepartamentosUseCases)
    private departamentosUseCases: IDepartamentosUseCases,
    @inject(TYPES.IPersonaToPersonaDTO)
    private personaMapper: IPersonaToPersonaDTO
  ) {}

  async getPersonas(): Promise<PersonaConListadoDepartamento[]> {
    const personas: Persona[] =
      await this.personasRepository.getListadoCompletoPersonas();
    const departamentos: Departamento[] =
      await this.departamentosUseCases.getDepartamentos();

    const resultado: PersonaConListadoDepartamento[] = [];

    for (let i = 0; i < personas.length; i++) {
      const personaDTO: PersonaDTO = this.personaMapper.map(personas[i]);
      const personaConListado = new PersonaConListadoDepartamento(
        personaDTO,
        departamentos
      );
      resultado.push(personaConListado);
    }

    return resultado;
  }

  comprobarAciertos(
    selecciones: PersonaConDepartamentoSeleccionado[],
    personas: PersonaDTO[]
  ): number {
    // Mapa: idPersona -> idDepartamentoCorrecto
    const correctoPorPersona = new Map<number, number>();
    for (const p of personas) {
      correctoPorPersona.set(p.id, p.idDepartamento);
    }

    let aciertos = 0;

    for (const s of selecciones) {
      const correcto = correctoPorPersona.get(s.idPersona);
      if (correcto !== undefined && correcto === s.idDepartamentoSeleccionado) {
        aciertos++;
      }
    }

    return aciertos;
  }
}
