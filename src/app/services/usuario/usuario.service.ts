import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/General/General';
import { CrearActualizarUsuarioDto } from '../../models/Usuario/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  baseUrl:string = environment.apiUrl ;
  constructor(private http: HttpClient) { }

  obtenerUsuarios(): Observable<ApiResponse<any>> {
   return this.http.get<ApiResponse<any>>(`${this.baseUrl}Usuario/ObtenerUsuarios`);
 }

 crearUsuario(dto: CrearActualizarUsuarioDto): Observable<ApiResponse<CrearActualizarUsuarioDto>> {
   return this.http.post<ApiResponse<CrearActualizarUsuarioDto>>(`${this.baseUrl}Usuario/CrearUsuario`, dto);
 }

 actualizarUsuario(id: number, usuario: CrearActualizarUsuarioDto): Observable<ApiResponse> {
   const url = `${this.baseUrl}Usuario/ActualizarUsuario/${id}`;
   return this.http.put<ApiResponse>(url, usuario);
 }
 

 obtenerTodosPermisos() {
   return this.http.get<any>(`${this.baseUrl}Permiso/ObtenerPermisos`);
 }
 
 obtenerPermisoPorUsuario(idUsuario: number): Observable<ApiResponse> {
   return this.http.get<ApiResponse>(`${this.baseUrl}Permiso/ObtenerPermisosUsuario/${idUsuario}`);
 }

 actualizarPermisosUsuario(idUsuario: number, permisosIds: number[]) {
   return this.http.post<any>(
     `${this.baseUrl}Permiso/ActualizarPermisosUsuario/${idUsuario}`,
     permisosIds
   );
 }

 // En tu servicio de usuario
 actualizarEstadoUsuario(idUsuario: number, estado: boolean) {
   const body = { estado }; // ¡Tiene que llamarse igual que en el DTO!
   return this.http.patch(`${this.baseUrl}Usuario/ActualizarEstadoUsuario/${idUsuario}`, body);
 }


 reestablecerIntentosUsuario(idUsuario: number) {
   const body = { intentosFallidos: 0 }; // Asumimos que los estás reiniciando a 0
   return this.http.patch(`${this.baseUrl}Usuario/ReestablecerIntentosUsuario/${idUsuario}`, body);
 }
 

 
}
