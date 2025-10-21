import { injectable } from "inversify";
import { Persona } from "../entities/Persona";

// IRepositoryPersonas Interface
export interface IRepositoryPersonas {
    getListadoCompletoPersonas(): Persona[];
}

// Default repository with a fixed list of people
@injectable()
export class PersonasRepository implements IRepositoryPersonas {
    getListadoCompletoPersonas(): Persona[] {
        return [
            new Persona(1, 'Álvaro', 'Valles'),
            new Persona(2, 'Adrián', 'San Miguel'),
            new Persona(3, 'Pau', 'López'),
            new Persona(4, 'Héctor', 'Bellerín'),
            new Persona(5, 'Diego', 'Llorente'),
            new Persona(6, 'Natan', 'de Souza'),
            new Persona(7, 'Marc', 'Bartra'),
            new Persona(8, 'Ricardo', 'Rodríguez'),
            new Persona(9, 'Valentín', 'Gómez'),
            new Persona(10, 'Junior', 'Firpo'),
            new Persona(11, 'Ángel', 'Ortiz'),
            new Persona(12, 'Sergi', 'Altimira'),
            new Persona(13, 'Pablo', 'Fornals'),
            new Persona(14, 'Sofyan', 'Amrabat'),
            new Persona(15, 'Nicolás', 'Deossa'),
            new Persona(16, 'Giovani', 'Lo Celso'),
            new Persona(17, 'Marc', 'Roca'),
            new Persona(18, 'Isco', 'Alarcón'),
            new Persona(19, 'Antony', 'dos Santos'),
            new Persona(20, 'Chimy', 'Ávila'),
            new Persona(21, 'Ez', 'Abde'),
            new Persona(22, 'Cédric', 'Bakambu'),
            new Persona(23, 'Rodrigo', 'Riquelme'),
            new Persona(24, 'Cucho', 'Hernández'),
            new Persona(25, 'Aitor', 'Ruibal'),
            new Persona(26, 'Pablo', 'García'),
        ];
    }
}

// Repository for Test 1: Empty List (returns an empty list of personas)
@injectable()
export class EmptyPersonasRepository implements IRepositoryPersonas {
    getListadoCompletoPersonas(): Persona[] {
        return []; // Return an empty list of personas
    }
}

// Repository for Test 2: 100 People (returns a list of 100 personas)
@injectable()
export class HundredPersonasRepository implements IRepositoryPersonas {
    getListadoCompletoPersonas(): Persona[] {
        const personas: Persona[] = [];
        for (let i = 1; i <= 100; i++) {
            personas.push(new Persona(i, `Persona ${i}`, `Apellido ${i}`));
        }
        return personas; // Return a list of 100 personas
    }
}
