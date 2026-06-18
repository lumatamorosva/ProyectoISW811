import { Router } from "express";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { especialidadController } from "../controllers/especialidad.controller";
import { createEspecialidadSchema, updateEspecialidadSchema } from "../DTOs/especialidad.dto";
export class EspecialidadRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new especialidadController()
        //Rutas
        //locahost:3000/profesionales/
        router.get('/', asyncHandler( controller.listar));
        router.get('/:id', asyncHandler(controller.get));
        router.post("/",validateRequest(createEspecialidadSchema),asyncHandler(controller.crear));
        router.put("/:id", validateRequest(updateEspecialidadSchema),asyncHandler(controller.actualizar));
        return router
    }
}
