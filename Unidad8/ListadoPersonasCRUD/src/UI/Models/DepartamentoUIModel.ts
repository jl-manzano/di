import { Departamento } from "../../Domain/Entities/Departamento";

export interface DepartamentoUIModel {
  idDepartamento: number;
  nombreDepartamento: string;
  color: string;
  icon: string;
}

export const toDepartamentoUIModel = (departamento: Departamento): DepartamentoUIModel => {
  // Aquí asignamos un color y un icono predeterminado
  const colors = ['#6C5CE7', '#00B894', '#FDCB6E', '#E17055', '#74B9FF'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  return {
    idDepartamento: departamento.idDepartamento,
    nombreDepartamento: departamento.nombreDepartamento,
    color: randomColor, // Asigna un color aleatorio
    icon: '🏢', // Asigna un icono por defecto, puedes cambiarlo según el departamento
  };
};