import { Router } from "express";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { servicioController } from "../controllers/servicio.controller";
import { createServicioSchema, updateServicioSchema } from "../DTOs/servicio.dto";
export class ServicioRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new servicioController()
        //Rutas
        //locahost:3000/profesionales/
        router.get('/', asyncHandler( controller.listar));
        router.get('/:id', asyncHandler(controller.get));
        router.post("/",validateRequest(createServicioSchema),asyncHandler(controller.crear));
        router.put("/:id", validateRequest(updateServicioSchema),asyncHandler(controller.actualizar));
        return router
    }
}
