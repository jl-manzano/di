import { PersonaDTO } from '../../Domain/DTOs/PersonaDTO';

export interface PersonaUIModel extends PersonaDTO {
  color?: string;
  initials?: string;
}

export const toPersonaUIModel = (dto: PersonaDTO): PersonaUIModel => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  const initials = `${dto.nombre.charAt(0)}${dto.apellidos.charAt(0)}`.toUpperCase();
  
  return {
    ...dto,
    color: randomColor,
    initials,
  };
};
