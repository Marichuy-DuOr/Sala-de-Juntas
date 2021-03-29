import { UserResponse } from './../../shared/models/user.interface';
//Verifica si el rol del usuario es admin o client
export class RoleValidator {
    isClient(user: UserResponse): boolean {
        return user.rol === 'client';
    }
    isAdmin(user: UserResponse): boolean {
        return user.rol === 'admin';
    }
}