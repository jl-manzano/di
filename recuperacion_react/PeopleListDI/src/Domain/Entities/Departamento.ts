
export class Departamento {
  private _idDepartamento: number;
  private _nombreDepartamento: string;

  constructor(idDepartamento: number, nombreDepartamento: string) {
    this._idDepartamento = idDepartamento;
    this._nombreDepartamento = nombreDepartamento;
  }

  public get idDepartamento(): number {
    return this._idDepartamento;
  }

  public get nombreDepartamento(): string {
    return this._nombreDepartamento;
  }
}