import { injectable } from "inversify";
import { Persona } from "../Domain/Entities/Persona";
import { IRepositoryPersonas } from "../Domain/Interfaces/IRepositoryPersonas";

// repositorio por defecto con una lista fija de personas
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

// repositorio para el test 1: lista vacía (devuelve una lista vacía de personas)
@injectable()
export class EmptyPersonasRepository implements IRepositoryPersonas {
    getListadoCompletoPersonas(): Persona[] {
        return []; // devuelve una lista vacía de personas
    }
}

// repositorio para el test 2: 100 personas (devuelve una lista de 100 personas)
@injectable()
export class HundredPersonasRepository implements IRepositoryPersonas {
    getListadoCompletoPersonas(): Persona[] {
        const personas: Persona[] = [];
        // crea una lista con 100 personas
        for (let i = 1; i <= 100; i++) {
            personas.push(new Persona(i, `Persona ${i}`, `Apellido ${i}`));
        }
        return personas; // devuelve la lista de 100 personas
    }
}