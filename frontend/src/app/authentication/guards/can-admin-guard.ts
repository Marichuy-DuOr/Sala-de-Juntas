import { tap, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class CanAdminGuard implements CanActivate {
    constructor(private authSvc: AuthService) {}
//Función que verifica si el usuario actual tiene permiso para activar la ruta solicitada.
    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        return this.authSvc.user$.pipe(
            take(1),
            map((user) => user && this.authSvc.isAdmin(user)),
            tap((canEdit) => {
                if (!canEdit) {
                    window.alert('Acceso denegado, necesita permisos de administrador');
                }
            })
        );
    }
}