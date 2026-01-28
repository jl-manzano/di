import { injectable, inject } from 'inversify';
import { IPersonaUseCases } from '../../Domain/Interfaces/Persona/IPersonaUseCases';
import { IPersonaRepository } from '../../Domain/Interfaces/Persona/IPersonaRepository';
import { PersonaDTO } from '../../Domain/DTOs/PersonaDTO';
import { Persona } from '../../Domain/Entities/Persona';
import { TYPES } from '../../Core/types';

@injectable()
export class PersonaUseCases implements IPersonaUseCases {
  constructor(
    @inject(TYPES.PersonaRepository) private personaRepository: IPersonaRepository
  ) {}

  /**
   * Calcula la edad de una persona a partir de su fecha de nacimiento
   */
  private calculateAge(fechaNac: Date): number {
    const today = new Date();
    const birthDate = new Date(fechaNac);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Verifica si hoy es viernes o sábado
   */
  private isFridayOrSaturday(): boolean {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Domingo, 5 = Viernes, 6 = Sábado
    return dayOfWeek === 5 || dayOfWeek === 6;
  }

  /**
   * Verifica si hoy es domingo
   */
  private isSunday(): boolean {
    const today = new Date();
    return today.getDay() === 0;
  }

  async getPersonas(): Promise<PersonaDTO[]> {
    let personas = await this.personaRepository.getAll();
    
    // REGLA DE NEGOCIO: Los viernes y sábados solo mostrar personas mayores de 18 años
    if (this.isFridayOrSaturday()) {
      personas = personas.filter(persona => {
        const age = this.calculateAge(persona.fechaNac);
        return age > 18;
      });
    }
    
    return personas;
  }

  async addPersona(persona: Persona): Promise<Persona> {
    return await this.personaRepository.create(persona);
  }

  async updatePersona(persona: Persona): Promise<Persona> {
    return await this.personaRepository.update(persona);
  }

  async deletePersona(id: number): Promise<void> {
    // REGLA DE NEGOCIO: Los domingos no se puede eliminar personas
    if (this.isSunday()) {
      throw new Error('No se permite eliminar personas los domingos');
    }
    
    await this.personaRepository.delete(id);
  }
}