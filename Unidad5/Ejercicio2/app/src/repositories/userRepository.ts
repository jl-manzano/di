// src/repositories/userRepository.ts
import { fetchUsers } from '../api/userApi';

export const getUsers = (userAge: number) => {
  return fetchUsers(userAge);
};
