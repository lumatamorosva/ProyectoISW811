import { Router } from 'express';
import { UsuarioRoutes } from './usuario.route';
import { ProfesionalRoutes } from './profesional.route';
export class AppRoutes {
    static get routes(): Router {
        const router = Router();
        // ----Agregar las rutas----
        router.use('/usuarios', UsuarioRoutes.routes),
        router.use('/profesionales', ProfesionalRoutes.routes)
        return router;
    }
}
