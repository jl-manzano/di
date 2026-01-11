import { PersonaConListadoDepartamento } from "../../DTOs/PersonaConListadoDepartamento";
import { PersonaConDepartamentoSeleccionado } from "../../DTOs/PersonaConDepartamentoSeleccionado";
import { PersonaDTO } from "../../DTOs/PersonaDTO";

export interface IPersonasUseCases {
  getPersonas(): Promise<PersonaConListadoDepartamento[]>;
  comprobarAciertos(
    selecciones: PersonaConDepartamentoSeleccionado[],
    personas: PersonaDTO[]
  ): number;
}
