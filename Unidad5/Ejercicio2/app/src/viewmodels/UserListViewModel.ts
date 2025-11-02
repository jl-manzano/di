// src/viewmodels/UserListViewModel.ts
import { fetchUsers } from '../api/userApi';

export default class UserListViewModel {
  users: any[] = [];
  loading: boolean = true;

  constructor(private userAge: number) {
    console.log("Initializing ViewModel with userAge:", userAge);
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    try {
      this.loading = true;  // Comienza la carga
      console.log("Loading started...");
      const users = await fetchUsers(this.userAge);  // Obtenemos los usuarios filtrados
      console.log("Users loaded:", users);
      this.users = users;
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
      this.users = [];  // Si hay un error, la lista de usuarios estará vacía
    } finally {
      this.loading = false;  // Cambiamos el estado de "loading" a false
      console.log("Loading finished, users:", this.users);  // Verificamos si los usuarios fueron cargados
    }
  }
}
