import { Router } from "express";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { categoriaController } from "../controllers/categoria.controller";
import { createCategoriaSchema, updateCategoriaSchema } from "../DTOs/categoria.dto";
export class CategoriaRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new categoriaController()
        //Rutas
        //locahost:3000/profesionales/
        router.get('/', asyncHandler( controller.listar));
        router.get('/:id', asyncHandler(controller.get));
        router.post("/",validateRequest(createCategoriaSchema),asyncHandler(controller.crear));
        router.put("/:id", validateRequest(updateCategoriaSchema),asyncHandler(controller.actualizar));
        return router
    }
}
