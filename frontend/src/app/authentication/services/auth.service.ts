/*El servicio de autenticacion se utiliza para iniciar y cerrar sesión en la aplicación,
notifica a otros componentes cuando el usuario inicia y cierra sesión, 
y permite el acceso al usuario actualmente conectado.*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { UserResponse, User, Roles } from '../../shared/models/user.interface';

import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RoleValidator } from '../helpers/roleValidator';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService extends RoleValidator {

  private user = new BehaviorSubject<UserResponse>(null);

  constructor(private httpClient: HttpClient, private router: Router) {
    super();
    this.checkToken();
  }

  get user$(): Observable<UserResponse> {
    return this.user.asObservable();
  }

  get userValue(): UserResponse {
    return this.user.getValue();
  }
//Inicio de sesion
  login(authData: User): Observable<UserResponse | void> {
    return this.httpClient
      .post<UserResponse>(`${environment.API_URL}/login`, authData)
      .pipe(
        map((user: UserResponse) => {
          this.saveLocalStorage(user);
          this.user.next(user);
          return user;
        }),
        catchError((err) => this.handlerError(err))
      );
  }
//Registra al usuario
  register(data){
    return this.httpClient.post(`${environment.API_URL}/register`, data).toPromise();
  }
//Cierre de sesion
  logout(): void {
    localStorage.removeItem('user');
    this.user.next(null);
    this.router.navigate(['/login']);
  }
//Verifica si el token del uaurio ha expirado
  private checkToken(): void {
    const user = JSON.parse(localStorage.getItem('user')) || null;

    if (user) {
      const isExpired = helper.isTokenExpired(user.token);

      if (isExpired) {
        this.logout();
      } else {
        this.user.next(user);
      }
    }
  }
//Guarda el usuario en localStorage
  private saveLocalStorage(user: UserResponse): void {
    const { idUsuario, message, ...rest } = user;
    localStorage.setItem('user', JSON.stringify(rest));
  }
//Muestra si se produjo algun error al recuperar los datos de cabecera
  private handlerError(err): Observable<never> {
    let errorMessage = 'An errror occured retrienving data';
    if (err) {
      errorMessage = `Error: code ${err.message}`;
    }
    // window.alert(errorMessage);
    document.getElementById('dos').style.display = 'block';
    setTimeout(() => document.getElementById('dos').style.display = 'none', 5000);
    
    return throwError(errorMessage);
  }
}
