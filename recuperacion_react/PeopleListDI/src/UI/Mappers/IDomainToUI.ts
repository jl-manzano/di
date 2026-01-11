import { PersonaConListadoDepartamento } from "../../Domain/DTOs/PersonaConListadoDepartamento";
import { PersonaConColor } from "../Models/PersonaConColor";

export interface IDomainToUI {
  transformar(persona: PersonaConListadoDepartamento): PersonaConColor;
}