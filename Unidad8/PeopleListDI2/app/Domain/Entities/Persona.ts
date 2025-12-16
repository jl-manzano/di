export class Persona {
  

  //#region Propiedades privadas
  private _id: number;
  private _nombre: string;
  private _apellidos: string;
  //#endregion



  //#region Constructor
  constructor(id: number, nombre: string, apellidos: string) {
    this._id = id;
    this._nombre = nombre;
    this._apellidos = apellidos;
  }
  //#endregion


  //#region Getters y Setters 
  public get id(): number {
    return this._id;
  }

  public set id(value: number) {
    this._id = value;
  }

  public get nombre(): string {
    return this._nombre;
  }

  public set nombre(value: string) {
    this._nombre = value;
  }

  public get apellidos(): string {
    return this._apellidos;
  }

  public set apellidos(value: string) {
    this._apellidos = value;
  }
  //#endregion

}