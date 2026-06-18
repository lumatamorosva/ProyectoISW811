import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from '../utils/http-response';
import { parseId } from '../utils/parse-id';
import { CategoriasService } from '../services/categorias.service';
export class categoriaController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
            const categorias = await CategoriasService.listar();
            return response.status(StatusCodes.OK).json({
                success: true,
                data: categorias,
            });
    };
    get = async (request: Request, response: Response, next: NextFunction) => {
        const categoria = await CategoriasService.get(parseInt(Array.isArray(request.params.id) ? request.params [0] : request.params.id))
            return response.status(StatusCodes.OK).json({
                success: true,
                data: categoria,
            });
    };
    crear = async (request:Request, response: Response, next: NextFunction)=>{
        const categoria = await CategoriasService.crear(request.body);
        return sendSuccess(response, categoria, "Categoría creada satisfactoriamente", StatusCodes.CREATED);
    };
    actualizar = async (request:Request, response: Response, next: NextFunction)=>{
        const id = parseId(request.params.id);
        const categoria = await CategoriasService.actualizar(id, request.body);
        return sendSuccess(response, categoria, "Categoría actualizada satisfactoriamente", StatusCodes.CREATED);
    };
}