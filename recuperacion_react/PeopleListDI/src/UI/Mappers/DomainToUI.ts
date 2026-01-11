import { injectable } from "inversify";
import { IDomainToUI } from "./IDomainToUI";
import { PersonaConListadoDepartamento } from "../../Domain/DTOs/PersonaConListadoDepartamento";
import { PersonaConColor } from "../Models/PersonaConColor";
import { PersonaDTO } from "../../Domain/DTOs/PersonaDTO";

@injectable()
export class DomainToUI implements IDomainToUI {
  private _colores: string[];

  constructor() {
    this._colores = ["#FFE5E5", "#E5F3FF", "#FFF5E5", "#E5FFE5"];
  }

  transformar(personaConListado: PersonaConListadoDepartamento): PersonaConColor {
    const depId = personaConListado.persona.idDepartamento ?? 0;
    const indiceDepartamento = depId - 1;

    let color = "#FFFFFF";
    if (indiceDepartamento >= 0 && indiceDepartamento < this._colores.length) {
      color = this._colores[indiceDepartamento];
    }

    // PersonaDTO ya tiene propiedades readonly, no necesitamos crear una nueva instancia
    return new PersonaConColor(
      personaConListado.persona,
      personaConListado.listadoDepartamentos,
      color
    );
  }
}