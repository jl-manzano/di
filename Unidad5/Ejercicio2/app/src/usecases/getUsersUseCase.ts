// src/usecases/getUsersUseCase.ts
import { getUsers } from '../repositories/userRepository';

export const fetchUsersUseCase = async (userAge: number) => {
  try {
    const users = await getUsers();
    return users.filter(
      (u: { age: number }) => Math.abs(u.age - userAge) <= 5
    );
  } catch {
    throw new Error('Failed to fetch users');
  }
};
