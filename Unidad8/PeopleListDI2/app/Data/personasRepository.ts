import { injectable } from "inversify";
import { Persona } from "../Domain/Entities/Persona";
import { IRepositoryPersonas } from "../Domain/Interfaces/IRepositoryPersonas";

@injectable()
export class PersonasRepository implements IRepositoryPersonas {
    async getListadoCompletoPersonas(): Promise<Persona[]> {
        try {
            // Hacemos una solicitud a la API para obtener la lista de personas
            const response = await fetch('https://ui20251201142043-dnhvdfbxdbh9bnbt.spaincentral-01.azurewebsites.net/api/Personas');
            
            // Verificamos si la respuesta fue exitosa
            if (!response.ok) {
                throw new Error('Error al obtener la lista de personas');
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
}
