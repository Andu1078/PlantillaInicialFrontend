import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CompartidoService } from '../../services/compartido/compartido.service';

export const authGuard: CanActivateFn = (route, state) => {
  const ComparitdoServicio = inject (CompartidoService);
  const router = inject (Router);
 
  const usuarioToken = ComparitdoServicio.obtenerSesion();
 
  if(usuarioToken != null){
   return true;
  }else{
   router.navigate(['login']);
   return false;
  }
}