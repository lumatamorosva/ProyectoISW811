import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from '../utils/http-response';
import { parseId } from '../utils/parse-id';
import { serviciosService } from '../services/servicios.service';
export class servicioController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
            const servicios = await serviciosService.listar();
            return response.status(StatusCodes.OK).json({
                success: true,
                data: servicios,
            });
    };
    get = async (request: Request, response: Response, next: NextFunction) => {
        const servicios = await serviciosService.get(parseInt(Array.isArray(request.params.id) ? request.params [0] : request.params.id))
            return response.status(StatusCodes.OK).json({
                success: true,
                data: servicios,
            });
    };
    crear = async (request:Request, response: Response, next: NextFunction)=>{
        const servicio = await serviciosService.crear(request.body);
        return sendSuccess(response, servicio, "Servicio creado satisfactoriamente", StatusCodes.CREATED);
    };
    actualizar = async (request:Request, response: Response, next: NextFunction)=>{
        const id = parseId(request.params.id);
        const servicio = await serviciosService.actualizar(id, request.body);
        return sendSuccess(response, servicio, "Servicio actualizado satisfactoriamente", StatusCodes.CREATED);
    };
}