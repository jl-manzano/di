export class Persona {
  //#region Atributos privados
  private _id: number;
  private _nombre: string;
  private _apellidos: string;
  private _fechaNac: Date;
  private _direccion: string;
  private _telefono: string;
  private _foto: string;
  private _idDepartamento: number;
  //#endregion

  //#region Constructores
  constructor();
  constructor(
    id: number,
    nombre: string,
    apellidos: string,
    fechaNac: Date,
    direccion: string,
    telefono: string,
    foto: string,
    idDepartamento: number
  );
  constructor(
    id?: number,
    nombre?: string,
    apellidos?: string,
    fechaNac?: Date,
    direccion?: string,
    telefono?: string,
    foto?: string,
    idDepartamento?: number
  ) {
    this._id = id || 0;
    this._nombre = nombre || "";
    this._apellidos = apellidos || "";
    this._fechaNac = fechaNac || new Date();
    this._direccion = direccion || "";
    this._telefono = telefono || "";
    this._foto = foto || "";
    this._idDepartamento = idDepartamento || 0;
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

  public get fechaNac(): Date {
    return this._fechaNac;
  }

  public set fechaNac(value: Date) {
    this._fechaNac = value;
  }

  public get direccion(): string {
    return this._direccion;
  }

  public set direccion(value: string) {
    this._direccion = value;
  }

  public get telefono(): string {
    return this._telefono;
  }

  public set telefono(value: string) {
    this._telefono = value;
  }

  public get foto(): string {
    return this._foto;
  }

  public set foto(value: string) {
    this._foto = value;
  }

  public get idDepartamento(): number {
    return this._idDepartamento;
  }

  public set idDepartamento(value: number) {
    this._idDepartamento = value;
  }
  //#endregion
}