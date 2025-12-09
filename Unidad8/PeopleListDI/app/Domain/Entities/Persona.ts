export class Persona {
    private _id: number;
    private _nombre: string;
    private _apellidos: string;

    constructor(id: number, nombre: string, apellidos: string) {
        this._id = id;
        this._nombre = nombre;
        this._apellidos = apellidos;
    }

    public get nombre(): string {
        return this._nombre;
    }

    public get apellidos(): string {
        return this._apellidos;
    }

    public get nombreCompleto(): string {
        return `${this._nombre} ${this._apellidos}`;
    }

    public get id(): number {
        return this._id;
    }

}