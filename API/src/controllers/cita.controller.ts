import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { profesionalService } from '../services/profesionales.service';
import { request } from 'node:http';
import { sendSuccess } from '../utils/http-response';
import { parseId } from '../utils/parse-id';
import { citaService } from '../services/cita.service';
export class citaController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
            const citas = await citaService.listar();
            return response.status(StatusCodes.OK).json({
                success: true,
                data: citas,
            });
    };
    get = async (request: Request, response: Response, next: NextFunction) => {
        const cita = await citaService.get(parseInt(Array.isArray(request.params.id) ? request.params [0] : request.params.id))
            return response.status(StatusCodes.OK).json({
                success: true,
                data: cita,
            });
    };
    crear = async (request:Request, response: Response, next: NextFunction)=>{
        const cita = await citaService.crear(request.body);
        return sendSuccess(response, cita, "Cita creada satisfactoriamente", StatusCodes.CREATED);
    };
    actualizar = async (request:Request, response: Response, next: NextFunction)=>{
        const id = parseId(request.params.id);
        const cita = await citaService.actualizar(id, request.body);
        return sendSuccess(response, cita, "Cita actualizada satisfactoriamente", StatusCodes.CREATED);
    };
}