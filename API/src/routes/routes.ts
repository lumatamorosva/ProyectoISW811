import { Router } from 'express';
import { UsuarioRoutes } from './usuario.route';
import { ProfesionalRoutes } from './profesional.route';
import { CategoriaRoutes } from './categoria.route';
import { EspecialidadRoutes } from './especialidad.route';
import { CitaRoutes } from './cita.route';
import { ServicioRoutes } from './servicio.route';
import { ImageRoutes } from './image.routes';
export class AppRoutes {
    static get routes(): Router {
        const router = Router();
        // ----Agregar las rutas----
        router.use('/usuarios', UsuarioRoutes.routes),
        router.use('/profesionales', ProfesionalRoutes.routes),
        router.use('/categorias', CategoriaRoutes.routes),
        router.use('/especialidades', EspecialidadRoutes.routes),
        router.use('/citas', CitaRoutes.routes),
        router.use('/servicios', ServicioRoutes.routes),
        router.use('/imagenes', ImageRoutes.routes)
        return router;
    }
}
