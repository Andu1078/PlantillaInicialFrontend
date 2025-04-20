import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/General/General';
import { Login, Sesion } from '../../models/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseUrl:string = environment.apiUrl + "Login";
  constructor(private http: HttpClient) { }

  iniciarSession(request: Login): Observable<ApiResponse<Sesion>> 
  {const url = `${this.baseUrl}/IniciarSesion`;
    return this.http.post<ApiResponse<Sesion>>(url, request);
  }
}
