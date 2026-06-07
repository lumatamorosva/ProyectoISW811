import { Router } from 'express';
import { UsuarioRoutes } from './usuario.route';
import { usuarioService } from '../services/usuarios.service';
export class AppRoutes {
    static get routes(): Router {
        const router = Router();
        // ----Agregar las rutas----
        router.use('/usuarios', UsuarioRoutes.routes)
        return router;
    }
}
