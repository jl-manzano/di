import { PersonaDTO } from "../../Domain/DTOs/PersonaDTO";
import { Departamento } from "../../Domain/Entities/Departamento";

export class PersonaConColor {
  //#region Atributos privados
  private _persona: PersonaDTO;
  private _departamentos: Departamento[];
  private _colorDepartamento: string;
  //#endregion

  //#region Constructor
  constructor(
    persona: PersonaDTO,
    departamentos: Departamento[],
    colorDepartamento: string
  ) {
    this._persona = persona;
    this._departamentos = departamentos;
    this._colorDepartamento = colorDepartamento;
  }
  //#endregion

  //#region Getters y Setters
  public get persona(): PersonaDTO {
    return this._persona;
  }

  public set persona(value: PersonaDTO) {
    this._persona = value;
  }

  public get departamentos(): Departamento[] {
    return this._departamentos;
  }

  public get colorDepartamento(): string {
    return this._colorDepartamento;
  }
  //#endregion
}