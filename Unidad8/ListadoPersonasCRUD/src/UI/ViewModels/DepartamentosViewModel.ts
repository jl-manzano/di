import { makeAutoObservable, runInAction } from 'mobx';
import { container } from '../../Core/container';
import { TYPES } from '../../Core/types';
import { DepartamentoUseCases } from '../../Domain/UseCases/DepartamentoUseCases'; // Importamos solo DepartamentoUseCases
import { Departamento } from '../../Domain/Entities/Departamento';

export class DepartamentosViewModel {
  private static instance: DepartamentosViewModel;
  
  departamentos: Departamento[] = []; // Ahora usamos directamente la entidad Departamento
  departamentoSeleccionado: Departamento | null = null; // También usamos la entidad Departamento
  isLoading = false;
  error: string | null = null;

  private departamentoUseCases: DepartamentoUseCases; // Solo usamos DepartamentoUseCases

  private constructor() {
    makeAutoObservable(this);

    this.departamentoUseCases = container.get<DepartamentoUseCases>(TYPES.DepartamentoUseCases); // Inyectamos solo DepartamentoUseCases
  }

  static getInstance(): DepartamentosViewModel {
    if (!DepartamentosViewModel.instance) {
      DepartamentosViewModel.instance = new DepartamentosViewModel();
    }
    return DepartamentosViewModel.instance;
  }

  private setLoadingState(loading: boolean) {
    this.isLoading = loading;
  }

  private setErrorState(message: string | null) {
    this.error = message;
  }

  async loadDepartamentos() {
    this.setLoadingState(true);
    this.setErrorState(null);
    
    try {
      const departamentos = await this.departamentoUseCases.getDepartamentos(); // Usamos el caso de uso para obtener departamentos
      runInAction(() => {
        this.departamentos = departamentos; // Asignamos directamente las entidades Departamento
        this.setLoadingState(false);
      });
    } catch (err) {
      this.handleError(err, 'Error al cargar los departamentos');
    }
  }

  private handleError(err: unknown, defaultMessage: string) {
    runInAction(() => {
      this.setErrorState(err instanceof Error ? err.message : defaultMessage);
      this.setLoadingState(false);
    });
  }

  async addDepartamento(departamento: Departamento) {
    this.setLoadingState(true);
    this.setErrorState(null);

    try {
      await this.departamentoUseCases.addDepartamento(departamento); // Usamos el caso de uso para agregar departamento
      await this.loadDepartamentos(); // Refresh the list after adding
    } catch (err) {
      this.handleError(err, 'Error al agregar departamento');
    }
  }

  async updateDepartamento(departamento: Departamento) {
    this.setLoadingState(true);
    this.setErrorState(null);

    try {
      await this.departamentoUseCases.updateDepartamento(departamento); // Usamos el caso de uso para actualizar departamento
      await this.loadDepartamentos(); // Refresh the list after updating
    } catch (err) {
      this.handleError(err, 'Error al actualizar departamento');
    }
  }

  async deleteDepartamento(id: number) {
    this.setLoadingState(true);
    this.setErrorState(null);

    try {
      await this.departamentoUseCases.deleteDepartamento(id); // Usamos el caso de uso para eliminar departamento
      await this.loadDepartamentos(); // Refresh the list after deleting
    } catch (err) {
      this.handleError(err, 'Error al eliminar departamento');
    }
  }

  selectDepartamento(departamento: Departamento | null) { // Usamos directamente la entidad Departamento
    this.departamentoSeleccionado = departamento;
  }
}
