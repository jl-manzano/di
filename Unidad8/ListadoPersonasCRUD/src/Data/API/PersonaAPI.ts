import { injectable, inject } from 'inversify';
import { Persona } from '../../Domain/Entities/Persona';
import { PersonaDTO } from '../../Domain/DTOs/PersonaDTO';
import { BaseApi } from './BaseAPI';
import { TYPES } from '../../Core/types';

@injectable()
export class PersonaApi {
  constructor(
    @inject(TYPES.BaseApi) private baseApi: BaseApi
  ) {}

  async getAll(): Promise<PersonaDTO[]> {
    const url = this.baseApi.getBaseUrl('/api/Personas');
    const response = await fetch(url, {
      method: 'GET',
      headers: this.baseApi.getDefaultHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener personas');
    }
    
    const data = await response.json();
    
    // Mapear la respuesta de la API al DTO
    return data.map((item: any) => ({
      id: item.id,
      nombre: item.nombre,
      apellidos: item.apellidos,
      fechaNac: new Date(item.fechaNac),
      direccion: item.direccion,
      telefono: item.telefono,
      foto: item.foto,
      idDepartamento: item.idDepartamento,
      nombreDepartamento: item.nombreDepartamento || '',
    }));
  }

  async getById(id: number): Promise<PersonaDTO | null> {
    const url = this.baseApi.getBaseUrl(`/api/Personas/${id}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.baseApi.getDefaultHeaders(),
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return {
      id: data.id,
      nombre: data.nombre,
      apellidos: data.apellidos,
      fechaNac: new Date(data.fechaNac),
      direccion: data.direccion,
      telefono: data.telefono,
      foto: data.foto,
      idDepartamento: data.idDepartamento,
      nombreDepartamento: data.nombreDepartamento || '',
    };
  }

  async create(persona: Persona): Promise<Persona> {
    const url = this.baseApi.getBaseUrl('/api/Personas');
    const response = await fetch(url, {
      method: 'POST',
      headers: this.baseApi.getDefaultHeaders(),
      body: JSON.stringify({
        nombre: persona.nombre,
        apellidos: persona.apellidos,
        fechaNac: persona.fechaNac.toISOString(),
        direccion: persona.direccion,
        telefono: persona.telefono,
        foto: persona.foto,
        idDepartamento: persona.idDepartamento,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Error al crear persona');
    }
    
    const data = await response.json();
    return new Persona(
      data.id,
      data.nombre,
      data.apellidos,
      new Date(data.fechaNac),
      data.direccion,
      data.telefono,
      data.foto,
      data.idDepartamento
    );
  }

  async update(persona: Persona): Promise<Persona> {
    const url = this.baseApi.getBaseUrl(`/api/Personas/${persona.id}`);
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.baseApi.getDefaultHeaders(),
      body: JSON.stringify({
        id: persona.id,
        nombre: persona.nombre,
        apellidos: persona.apellidos,
        fechaNac: persona.fechaNac.toISOString(),
        direccion: persona.direccion,
        telefono: persona.telefono,
        foto: persona.foto,
        idDepartamento: persona.idDepartamento,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Error al actualizar persona');
    }
    
    const data = await response.json();
    return new Persona(
      data.id,
      data.nombre,
      data.apellidos,
      new Date(data.fechaNac),
      data.direccion,
      data.telefono,
      data.foto,
      data.idDepartamento
    );
  }

  async delete(id: number): Promise<void> {
    const url = this.baseApi.getBaseUrl(`/api/Personas/${id}`);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.baseApi.getDefaultHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Error al eliminar persona');
    }
  }
}
