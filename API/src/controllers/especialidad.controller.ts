import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { profesionalService } from '../services/profesionales.service';
import { request } from 'node:http';
import { sendSuccess } from '../utils/http-response';
import { parseId } from '../utils/parse-id';
import { especialidadService } from '../services/especialides.service';
export class especialidadController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
            const especialidad = await especialidadService.listar();
            return response.status(StatusCodes.OK).json({
                success: true,
                data: especialidad,
            });
    };
    get = async (request: Request, response: Response, next: NextFunction) => {
        const especialidad = await especialidadService.get(parseInt(Array.isArray(request.params.id) ? request.params [0] : request.params.id))
            return response.status(StatusCodes.OK).json({
                success: true,
                data: especialidad,
            });
    };
    crear = async (request:Request, response: Response, next: NextFunction)=>{
        const especialidad = await especialidadService.crear(request.body);
        return sendSuccess(response, especialidad, "Especialidad creada satisfactoriamente", StatusCodes.CREATED);
    };
    actualizar = async (request:Request, response: Response, next: NextFunction)=>{
        const id = parseId(request.params.id);
        const especialidad = await especialidadService.actualizar(id, request.body);
        return sendSuccess(response, especialidad, "Especialidad actualizada satisfactoriamente", StatusCodes.CREATED);
    };
}