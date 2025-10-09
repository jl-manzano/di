import { Persona } from '../entities/PersonaModel'

export class RepositoryPersonas {
    private static personas: Persona[] = [
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

    public static getPersonas(): Persona[] {
        return this.personas;
    } 

}
