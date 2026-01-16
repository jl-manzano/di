import { injectable, inject } from 'inversify';
import { Departamento } from '../../Domain/Entities/Departamento';
import { BaseApi } from './BaseAPI';
import { TYPES } from '../../Core/types';

@injectable()
export class DepartamentoApi {
  constructor(
    @inject(TYPES.BaseApi) private baseApi: BaseApi
  ) {}

  async getAll(): Promise<Departamento[]> {
    const url = this.baseApi.getBaseUrl('/api/Departamentos');
    const response = await fetch(url, {
      method: 'GET',
      headers: this.baseApi.getDefaultHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener departamentos');
    }
    
    const data = await response.json();
    return data.map((item: any) => new Departamento(item.idDepartamento, item.nombreDepartamento));
  }

  async getById(id: number): Promise<Departamento | null> {
    const url = this.baseApi.getBaseUrl(`/api/Departamentos/${id}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.baseApi.getDefaultHeaders(),
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return new Departamento(data.idDepartamento, data.nombreDepartamento);
  }

  async create(departamento: Departamento): Promise<Departamento> {
    const url = this.baseApi.getBaseUrl('/api/Departamentos');
    const response = await fetch(url, {
      method: 'POST',
      headers: this.baseApi.getDefaultHeaders(),
      body: JSON.stringify({
        nombreDepartamento: departamento.nombreDepartamento,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Error al crear departamento');
    }
    
    const data = await response.json();
    return new Departamento(data.idDepartamento, data.nombreDepartamento);
  }

  async update(departamento: Departamento): Promise<Departamento> {
    const url = this.baseApi.getBaseUrl(`/api/Departamentos/${departamento.idDepartamento}`);
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.baseApi.getDefaultHeaders(),
      body: JSON.stringify({
        idDepartamento: departamento.idDepartamento,
        nombreDepartamento: departamento.nombreDepartamento,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Error al actualizar departamento');
    }
    
    // Verificar si hay contenido JSON en la respuesta
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return new Departamento(data.idDepartamento, data.nombreDepartamento);
    }
    
    // Si no hay JSON, devolvemos el departamento que enviamos
    return departamento;
  }

  async delete(id: number): Promise<void> {
    const url = this.baseApi.getBaseUrl(`/api/Departamentos/${id}`);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.baseApi.getDefaultHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al eliminar departamento: ${errorText || response.statusText}`);
    }
    
    // DELETE usualmente no devuelve contenido (204 No Content)
  }
}