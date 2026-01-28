import { PersonaDTO } from '../../Domain/DTOs/PersonaDTO';
import { DepartamentosViewModel } from '../ViewModels/DepartamentosViewModel';

export interface PersonaUIModel extends PersonaDTO {
  color?: string;
  initials?: string;
}

export const toPersonaUIModel = (dto: PersonaDTO): PersonaUIModel => {
  const colors = ['#6C5CE7', '#00B894', '#FDCB6E', '#E17055', '#74B9FF', '#A29BFE', '#FF7675', '#FD79A8', '#55EFC4', '#81ECEC'];
  
  // asignar color basado en el idDepartamento para que coincida con el color del departamento
  const colorIndex = dto.idDepartamento % colors.length;
  const assignedColor = colors[colorIndex];
  
  const initials = `${dto.nombre.charAt(0)}${dto.apellidos.charAt(0)}`.toUpperCase();
  
  // si el nombreDepartamento está vacío, intentar obtenerlo del ViewModel de departamentos
  let nombreDepartamento = dto.nombreDepartamento;
  if (!nombreDepartamento || nombreDepartamento.trim() === '') {
    const departamentosVM = DepartamentosViewModel.getInstance();
    const departamento = departamentosVM.departamentos.find(d => d.idDepartamento === dto.idDepartamento);
    nombreDepartamento = departamento ? departamento.nombreDepartamento : 'Sin departamento';
  }
  
  return {
    ...dto,
    nombreDepartamento,
    color: assignedColor,
    initials,
  };
};