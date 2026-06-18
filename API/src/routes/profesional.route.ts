import { Router } from "express";
import { profesionalController } from "../controllers/profesional.controller";
import { createProfesionalSchema, updateProfesionalSchema } from "../DTOs/profesional.dto";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { asyncHandler } from "../middlewares/async-handler.middleware";
export class ProfesionalRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new profesionalController()
        //Rutas
        //locahost:3000/profesionales/
        router.get('/', asyncHandler( controller.listar));
        router.get('/:id', asyncHandler(controller.get));
        router.post("/",validateRequest(createProfesionalSchema),asyncHandler(controller.crear));
        router.put("/:id", validateRequest(updateProfesionalSchema),asyncHandler(controller.actualizar));
        return router
    }
}
