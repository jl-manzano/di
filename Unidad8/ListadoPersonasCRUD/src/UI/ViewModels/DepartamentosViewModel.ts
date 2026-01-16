import { makeAutoObservable, runInAction } from 'mobx';
import { container } from '../../Core/container';
import { TYPES } from '../../Core/types';
import { DepartamentoUseCases } from '../../Domain/UseCases/DepartamentoUseCases';
import { Departamento } from '../../Domain/Entities/Departamento';
import { DepartamentoUIModel, toDepartamentoUIModel } from '../Models/DepartamentoUIModel';

export class DepartamentosViewModel {
  private static instance: DepartamentosViewModel;

  departamentos: DepartamentoUIModel[] = [];
  departamentoSeleccionado: DepartamentoUIModel | null = null;
  isLoading = false;
  error: string | null = null;

  private departamentoUseCases: DepartamentoUseCases;

  private constructor() {
    makeAutoObservable(this);

    this.departamentoUseCases = container.get<DepartamentoUseCases>(TYPES.DepartamentoUseCases);
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
      const departamentos = await this.departamentoUseCases.getDepartamentos();
      runInAction(() => {
        this.departamentos = departamentos.map(toDepartamentoUIModel);
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
      await this.departamentoUseCases.addDepartamento(departamento);
      await this.loadDepartamentos();
    } catch (err) {
      this.handleError(err, 'Error al agregar departamento');
      throw err; // Re-throw para que la UI pueda manejarlo
    }
  }

  async updateDepartamento(departamento: Departamento) {
    this.setLoadingState(true);
    this.setErrorState(null);

    try {
      await this.departamentoUseCases.updateDepartamento(departamento);
      await this.loadDepartamentos();
    } catch (err) {
      this.handleError(err, 'Error al actualizar departamento');
      throw err;
    }
  }

  async deleteDepartamento(id: number) {
    this.setLoadingState(true);
    this.setErrorState(null);

    try {
      await this.departamentoUseCases.deleteDepartamento(id);
      await this.loadDepartamentos();
    } catch (err) {
      this.handleError(err, 'Error al eliminar departamento');
      throw err; // Re-throw para que la UI pueda manejarlo
    }
  }

  selectDepartamento(departamento: DepartamentoUIModel | null) {
    this.departamentoSeleccionado = departamento;
  }
}