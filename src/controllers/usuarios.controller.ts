import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { usuarioService } from '../services/usuarios.service';
import { request } from 'node:http';
import { sendSuccess } from '../utils/http-response';
import { parseId } from '../utils/parse-id';
export class UsuarioController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
            const usuarios = await usuarioService.listar();
            return response.status(StatusCodes.OK).json({
                success: true,
                data: usuarios,
            });
    };
    get = async (request: Request, response: Response, next: NextFunction) => {
        const usuario = await usuarioService.get(parseInt(Array.isArray(request.params.id) ? request.params [0] : request.params.id))
            return response.status(StatusCodes.OK).json({
                success: true,
                data: usuario,
            });
    };
    crear = async (request:Request, response: Response, next: NextFunction)=>{
        const usuario = await usuarioService.crear(request.body);
        return sendSuccess(response, usuario, "Usuario creado satisfactoriamente", StatusCodes.CREATED);
    };
    actualizar = async (request:Request, response: Response, next: NextFunction)=>{
        const id = parseId(request.params.id);
        const usuario = await usuarioService.actualizar(id, request.body);
        return sendSuccess(response, usuario, "Usuario actualizado satisfactoriamente", StatusCodes.CREATED);
    };
}