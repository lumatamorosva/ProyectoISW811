import { Router } from "express";
import { UsuarioController } from "../controllers/usuarios.controller";
export class UsuarioRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new UsuarioController()
        //Rutas
        //locahost:3000/usuarios/
        router.get('/', controller.listar);
        router.get('/:id', controller.get);
        return router
    }
}
