import { Departamento } from "../../Domain/Entities/Departamento";

export interface DepartamentoUIModel {
  idDepartamento: number;
  nombreDepartamento: string;
  color: string;
  icon: string;
}

export const toDepartamentoUIModel = (departamento: Departamento): DepartamentoUIModel => {
  const colors = ['#6C5CE7', '#00B894', '#FDCB6E', '#E17055', '#74B9FF', '#A29BFE', '#FF7675', '#FD79A8', '#55EFC4', '#81ECEC'];
  
  // Asignar color basado en el ID del departamento para que sea consistente
  const colorIndex = departamento.idDepartamento % colors.length;
  const assignedColor = colors[colorIndex];
  
  return {
    idDepartamento: departamento.idDepartamento,
    nombreDepartamento: departamento.nombreDepartamento,
    color: assignedColor,
    icon: '🏢',
  };
};