import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { usuarioService } from '../services/usuarios.service';
export class UsuarioController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const usuarios = await usuarioService.listar();
            return response.status(StatusCodes.OK).json({
                success: true,
                data: usuarios,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };
    get = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const usuario = await usuarioService.get(parseInt(Array.isArray(request.params.id) ? request.params [0] : request.params.id))
            return response.status(StatusCodes.OK).json({
                success: true,
                data: usuario,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };
}