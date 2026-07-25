import { inject } from '@angular/core';
import { CanActivateFn,Router} from '@angular/router';
import {map,of,switchMap,} from 'rxjs';
import { AuthService } from '../services/auth.service';
export const authGuard: CanActivateFn =() => {
        const authService =inject(AuthService);
        const router = inject(Router);
        if (authService.autenticado()) {return true;}
        if (!authService.obtenerToken()) { return router.createUrlTree(['unauthorized']);  }
        return authService.cargarPerfil().pipe(
            map((usuario)=>{return usuario? true : router.createUrlTree(['login']);}),
        )
};