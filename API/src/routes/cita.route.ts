import { Router } from "express";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { citaController } from "../controllers/cita.controller";
import { createCitaSchema, updateCitaSchema } from "../DTOs/cita.dto";
export class CitaRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new citaController()
        //Rutas
        //locahost:3000/profesionales/
        router.get('/', asyncHandler( controller.listar));
        router.get('/:id', asyncHandler(controller.get));
        router.post("/",validateRequest(createCitaSchema),asyncHandler(controller.crear));
        router.put("/:id", validateRequest(updateCitaSchema),asyncHandler(controller.actualizar));
        return router
    }
}