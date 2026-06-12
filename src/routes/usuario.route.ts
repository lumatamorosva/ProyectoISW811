import { Router } from "express";
import { UsuarioController } from "../controllers/usuarios.controller";
import { createUsuarioSchema, updateUsuarioSchema } from "../DTOs/usuario.dto";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { asyncHandler } from "../middlewares/async-handler.middleware";
export class UsuarioRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new UsuarioController()
        //Rutas
        //locahost:3000/usuarios/
        router.get('/', asyncHandler( controller.listar));
        router.get('/:id', asyncHandler(controller.get));
        router.post("/",validateRequest(createUsuarioSchema),asyncHandler(controller.crear));
        router.put("/:id", validateRequest(updateUsuarioSchema),asyncHandler(controller.actualizar));
        return router
    }
}
