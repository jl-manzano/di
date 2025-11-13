// src/usecases/getUsersUseCase.ts
import { getUsers } from '../repositories/userRepository';

export const getUsersUseCase = (userAge: number) => {
  return getUsers(userAge);
};
