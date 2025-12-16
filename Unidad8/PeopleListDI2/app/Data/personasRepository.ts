import { injectable } from "inversify";
import { IPersonasRepository } from "../Domain/Interfaces/IPersonasRepository";
import { Persona } from "../Domain/Entities/Persona";

@injectable()
export class PersonasRepository implements IPersonasRepository {
    // Implementación del método para obtener todas las personas
    async getListadoCompletoPersonas(): Promise<Persona[]> {
        try {
            // Hacemos una solicitud a la API para obtener la lista de personas
            const response = await fetch('https://ui20251201142043-dnhvdfbxdbh9bnbt.spaincentral-01.azurewebsites.net/api/Personas');
            
            // Verificamos si la respuesta fue exitosa
            if (!response.ok) {
                // CORREGIDO: Uso de backticks (``)
                throw new Error(`Error al obtener la lista de personas: ${response.status} ${response.statusText}`);
            }

            // Obtenemos los datos en formato JSON
            const personasData = await response.json();

            // Convertimos los datos en objetos Persona
            return personasData.map((data: { id: number; nombre: string; apellidos: string }) => 
                new Persona(data.id, data.nombre, data.apellidos)
            );
        } catch (error) {
            console.error("Error obteniendo personas:", error);
            return []; // Si hay un error, retornamos una lista vacía
        }
    }

    // Implementación del método para obtener una persona por su ID
    async getPersonaPorId(id: number): Promise<Persona | undefined> {
        try {
            // CORREGIDO: Uso de backticks (``) para la URL
            const response = await fetch(`https://ui20251201142043-dnhvdfbxdbh9bnbt.spaincentral-01.azurewebsites.net/api/Personas/${id}`);
            
            // Verificamos si la respuesta fue exitosa
            if (!response.ok) {
                // CORREGIDO: Uso de backticks (``) para el mensaje de error
                throw new Error(`Error al obtener la persona con ID ${id}: ${response.status} ${response.statusText}`);
            }

            // Obtenemos los datos de la persona en formato JSON
            const personaData = await response.json();

            // Convertimos el dato recibido en un objeto Persona
            return new Persona(personaData.id, personaData.nombre, personaData.apellidos);
        } catch (error) {
            console.error("Error obteniendo persona:", error);
            return undefined; // Si hay un error, retornamos undefined
        }
    }
}