import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Sesion } from '../../models/login';

@Injectable({
  providedIn: 'root'
})
export class CompartidoService {

  constructor(private messageService: MessageService) { }

   // Servivio de mensaje notificacion (mensaje/tipo)
   mostrarAlerta(mensaje: string, tipo: 'success' | 'error' | 'info' | 'warn' = 'error') {
    this.messageService.add({
      severity: tipo, // Tipo de mensaje (success para el chulito) 
      summary:tipo,
      detail: mensaje,
      life: 1200, // Tiempo de vida en milisegundos (3 segundos)

    });
  }  //mejor y mucho mas facil , me ahorro un crud complero de permisos

  // Guarda la sesion del usuario en local storage(validar mejor opcion)
  guardarSesion(sesion: Sesion) {
    localStorage.setItem("SessionUsuario", JSON.stringify(sesion));
  }

  // Obtener el objeto session de local storage 
  obtenerSesion() {
    const sesionString = localStorage.getItem("SessionUsuario");
    const usuarioSesion = JSON.parse(sesionString!);
    return usuarioSesion;
  }

   // eliminar el objeto session de local storage 
   eliminarSesion() {
    localStorage.removeItem("SessionUsuario");
  }

  // Obtener el nombre del  objeto session de local storage 
  obtenerNombreUsuario(): string | null {
    const usuarioSesion = this.obtenerSesion();
    return usuarioSesion?.nombreCompleto || null; // Retorna el nombre o null si no existe
  }

  // Obtener la cedula  del objeto session de local storage 
  obtenerIdUsuario(): number{
    const cedulaSession = this.obtenerSesion();
    return cedulaSession?.idUsuario || null; // Retorna el nombre o null si no existe
  }
}
