import { makeAutoObservable, runInAction } from 'mobx';
import { container } from '../../Core/container';
import { TYPES } from '../../Core/types';
import { PersonaUseCases } from '../../Domain/UseCases/PersonaUseCases';
import { PersonaUIModel, toPersonaUIModel } from '../Models/PersonaUIModel';
import { Persona } from '../../Domain/Entities/Persona';

export class PersonasViewModel {
  private static instance: PersonasViewModel;

  personas: PersonaUIModel[] = [];
  personaSeleccionada: PersonaUIModel | null = null;
  isLoading = false;
  error: string | null = null;

  private personaUseCases: PersonaUseCases;

  private constructor() {
    makeAutoObservable(this);

    this.personaUseCases = container.get<PersonaUseCases>(TYPES.PersonaUseCases);
  }

  static getInstance(): PersonasViewModel {
    if (!PersonasViewModel.instance) {
      PersonasViewModel.instance = new PersonasViewModel();
    }
    return PersonasViewModel.instance;
  }

  private setLoadingState(loading: boolean) {
    this.isLoading = loading;
  }

  private setErrorState(message: string | null) {
    this.error = message;
  }

  async loadPersonas() {
    this.setLoadingState(true);
    this.setErrorState(null);

    try {
      const personas = await this.personaUseCases.getPersonas();
      runInAction(() => {
        this.personas = personas.map(toPersonaUIModel);
        this.setLoadingState(false);
      });
    } catch (err) {
      this.handleError(err, 'Error al cargar las personas');
    }
  }

  private handleError(err: unknown, defaultMessage: string) {
    runInAction(() => {
      this.setErrorState(err instanceof Error ? err.message : defaultMessage);
      this.setLoadingState(false);
    });
  }

  async addPersona(persona: Persona) {
    this.setLoadingState(true);
    this.setErrorState(null);

    try {
      await this.personaUseCases.addPersona(persona);
      await this.loadPersonas();
    } catch (err) {
      this.handleError(err, 'Error al agregar persona');
      throw err; // Re-throw para que la UI pueda manejarlo
    }
  }

  async updatePersona(persona: Persona) {
    this.setLoadingState(true);
    this.setErrorState(null);

    try {
      await this.personaUseCases.updatePersona(persona);
      await this.loadPersonas();
    } catch (err) {
      this.handleError(err, 'Error al actualizar persona');
      throw err;
    }
  }

  async deletePersona(id: number) {
    this.setLoadingState(true);
    this.setErrorState(null);

    try {
      await this.personaUseCases.deletePersona(id);
      await this.loadPersonas();
    } catch (err) {
      this.handleError(err, 'Error al eliminar persona');
      throw err; // Re-throw para que la UI pueda manejarlo
    }
  }

  selectPersona(persona: PersonaUIModel | null) {
    this.personaSeleccionada = persona;
  }
}