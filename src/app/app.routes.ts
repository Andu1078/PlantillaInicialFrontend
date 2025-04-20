import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [

       // Redirección inicial al login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Ruta para el componente Login
  {
    path: 'login',
    loadComponent: () =>
        import('../app/components/login/login.component').then(
            (m) => m.LoginComponent
        )
  },

  // Ruta para el componente Inicio
  {
    path: 'Inicio',
    canActivate: [authGuard],
    loadComponent: () =>
        import('../app/components/inicio/inicio.component').then(
            (m) => m.InicioComponent
        )
  },
   // Ruta para el componente Usuarios
   {
    path: 'Usuarios',
    canActivate: [authGuard],
    loadComponent: () =>
        import('../app/components/admon/usuarios/usuarios.component').then(
            (m) => m.UsuariosComponent
        )
  },

  { path: '**', redirectTo: 'login', pathMatch: 'full' }


];

