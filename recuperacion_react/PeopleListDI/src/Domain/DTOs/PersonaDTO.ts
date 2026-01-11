export class PersonaDTO {
  constructor(
    public readonly id: number,
    public readonly nombre: string,
    public readonly apellidos: string,
    public readonly idDepartamento: number
  ) {}
}