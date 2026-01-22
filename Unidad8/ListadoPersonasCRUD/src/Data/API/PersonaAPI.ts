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

  async uploadImage(imageUri: string): Promise<string> {
    try {
      const formData = new FormData();
      
      // En web, necesitamos convertir la URI a un blob
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      // Agregar la imagen al FormData
      formData.append('file', blob, 'profile.jpg');

      // Subir al servidor
      const url = this.baseApi.getBaseUrl('/api/Personas/upload-image');
      const uploadResponse = await fetch(url, {
        method: 'POST',
        body: formData,
        // No incluir Content-Type header, el navegador lo establecerá automáticamente con el boundary correcto
      });

      if (!uploadResponse.ok) {
        throw new Error('Error al subir la imagen');
      }

      const data = await uploadResponse.json();
      // El servidor debe devolver { url: "https://..." }
      return data.url || data.imageUrl || data.path;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw error;
    }
  }

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
    console.log('PersonaApi.update - iniciado con:', persona);
    const url = this.baseApi.getBaseUrl(`/api/Personas/${persona.id}`);
    console.log('PersonaApi.update - URL:', url);
    
    const body = JSON.stringify({
      id: persona.id,
      nombre: persona.nombre,
      apellidos: persona.apellidos,
      fechaNac: persona.fechaNac.toISOString(),
      direccion: persona.direccion,
      telefono: persona.telefono,
      foto: persona.foto,
      idDepartamento: persona.idDepartamento,
    });
    
    console.log('PersonaApi.update - Body:', body);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.baseApi.getDefaultHeaders(),
      body: body,
    });
    
    console.log('PersonaApi.update - Response status:', response.status);
    console.log('PersonaApi.update - Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('PersonaApi.update - Error response:', errorText);
      throw new Error(`Error al actualizar persona: ${errorText || response.statusText}`);
    }
    
    // Verificar si hay contenido en la respuesta
    const text = await response.text();
    console.log('PersonaApi.update - Response text:', text);
    
    // Si hay contenido JSON, parsearlo
    if (text && text.length > 0) {
      try {
        const data = JSON.parse(text);
        console.log('PersonaApi.update - Parsed data:', data);
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
      } catch (e) {
        console.log('PersonaApi.update - Error parseando JSON, devolviendo persona original');
        return persona;
      }
    }
    
    console.log('PersonaApi.update - Sin contenido, devolviendo persona original');
    return persona;
  }

  async delete(id: number): Promise<void> {
    console.log('PersonaApi.delete - iniciado con id:', id);
    const url = this.baseApi.getBaseUrl(`/api/Personas/${id}`);
    console.log('PersonaApi.delete - URL:', url);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.baseApi.getDefaultHeaders(),
    });
    
    console.log('PersonaApi.delete - Response status:', response.status);
    console.log('PersonaApi.delete - Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('PersonaApi.delete - Error response:', errorText);
      throw new Error(`Error al eliminar persona: ${errorText || response.statusText}`);
    }
    
    console.log('PersonaApi.delete - Completado exitosamente');
  }
}