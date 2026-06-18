import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { profesionalService } from '../services/profesionales.service';
import { request } from 'node:http';
import { sendSuccess } from '../utils/http-response';
import { parseId } from '../utils/parse-id';
export class profesionalController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
            const profesionales = await profesionalService.listar();
            return response.status(StatusCodes.OK).json({
                success: true,
                data: profesionales,
            });
    };
    get = async (request: Request, response: Response, next: NextFunction) => {
        const profesional = await profesionalService.get(parseInt(Array.isArray(request.params.id) ? request.params [0] : request.params.id))
            return response.status(StatusCodes.OK).json({
                success: true,
                data: profesional,
            });
    };
    crear = async (request:Request, response: Response, next: NextFunction)=>{
        const profesional = await profesionalService.crear(request.body);
        return sendSuccess(response, profesional, "Profesional creado satisfactoriamente", StatusCodes.CREATED);
    };
    actualizar = async (request:Request, response: Response, next: NextFunction)=>{
        const id = parseId(request.params.id);
        const profesional = await profesionalService.actualizar(id, request.body);
        return sendSuccess(response, profesional, "Profesional actualizado satisfactoriamente", StatusCodes.CREATED);
    };
}