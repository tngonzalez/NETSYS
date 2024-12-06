import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, BehaviorSubject, tap, map } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';

/*export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    nombreCompleto: string;
    rol: any;
  };
}*/

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiURL;
  private userSubject = new BehaviorSubject<any>(null);
 // public user$ = this.userSubject.asObservable();
  private usuario = new BehaviorSubject<any>(null);
  private tokenUserSubject = new BehaviorSubject<any>(null);
  private authenticated = new BehaviorSubject<boolean>(false);
  public isLogin = false;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    let cs = localStorage.getItem('token');

    if(cs && cs != "undefined"){
      this.tokenUserSubject = new BehaviorSubject<any>(
        JSON.parse(cs)
      ); 
    }

    this.currentUser = this.tokenUserSubject.asObservable();
  }

  login(formData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}usuario/login`, 
      { correo: formData.correo, clave: formData.clave }, 
      { headers }
    ).pipe(
      map((response) => {
        localStorage.setItem('token', JSON.stringify(response.token));
        this.authenticated.next(true);
        this.tokenUserSubject.next(response.token);
        return this.decodeToken;
      }),
      catchError(this.handleError)
    );
  }

  

 setToken(token: any) {
    this.isLogin = false;
    localStorage.setItem('token', token);
  }

  public get getToken(): any {
    this.isLogin = false;
    return this.tokenUserSubject.value;
  }

  get decodeToken(): any {
    this.isLogin = false;
    this.usuario.next(null);
    if (this.getToken != null ) {
      this.usuario.next(jwtDecode(this.getToken))
    }
   
    return this.usuario.asObservable();
  }


  get isAuthenticated() {
    this.isLogin = false;
    if (this.getToken != null) {
      this.authenticated.next(true);
    } else {
      this.authenticated.next(false);
    }
    return this.authenticated.asObservable();
  }

  logout() {
    this.isLogin = false;
    let usuario = this.tokenUserSubject.value;
    if (usuario) {
      localStorage.removeItem('token');
      this.tokenUserSubject.next(null);
      this.authenticated.next(false);
      return true;
    }
    return false;
  }

/*  get getUser(): Observable<any> {
    return this.user$;
  }*/

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error inesperado';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.error.Message || error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
