import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompartidoService } from '../../services/compartido/compartido.service';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../models/General/General';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [MenubarModule, ButtonModule, ToastModule, RippleModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent {
  // Items de la barra de navegacion
  menubaritems: any[] = [];

  //Variable para nombre de usuario
  usuario: string | null = null;

  //Variable para nombre de usuario
  idUsuario: number = 0;

  //Inyecta servicios necesarios
  constructor(
    private router: Router,
    private compartidoServicio: CompartidoService,
    private usuarioService: UsuarioService
  ) {}

  //Inicializa los menus  y el nombre de usuario
  ngOnInit() {
    // Menu dinamico
    this.menubaritems = [
      //Administracion
      {
        label: 'Administración',
        icon: 'pi pi-spin pi-cog',
        items: [
          {
            label: 'Usuarios',
            icon: 'bi bi-person-circle',
            command: () => this.navegarSiTienePermiso('/Usuarios', 1),
          },
        ],
      },
    ];

    // Actualizamos el nombre del usuario
    this.usuario = this.compartidoServicio.obtenerNombreUsuario();
    if (!this.usuario) {
      this.compartidoServicio.mostrarAlerta(
        'No se pudo obtener el nombre del usuario..',
        'error'
      );
      return;
    }

    this.compartidoServicio.mostrarAlerta(this.usuario);
  }

  // Elimina la session y redirige al login
  cerrarSesion() {
    this.compartidoServicio.eliminarSesion();
    this.router.navigate(['login']);
  }

  navegarSiTienePermiso(ruta: string, permiso: number) {
    this.idUsuario = this.compartidoServicio.obtenerIdUsuario();
  
    this.usuarioService.obtenerPermisoPorUsuario(this.idUsuario).subscribe({
      next: (resp: ApiResponse) => {
        if (resp.isExitoso) {
          const permisos = resp.resultado.permisos as { idPermiso: number }[];
  
          // Validamos si el usuario tiene el permiso
          const tienePermiso = permisos.some(p => p.idPermiso === permiso);
  
          if (tienePermiso) {
            this.router.navigate([ruta]);
          } else {
            this.compartidoServicio.mostrarAlerta('No tiene permisos para acceder a este módulo', 'warn');
          }
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar permisos:', error);
        this.compartidoServicio.mostrarAlerta(
          'Error al cargar los permisos',
          'error'
        );
      },
    });
  }
  
}
