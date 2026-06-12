import { prisma } from "../config/prisma";
import { number } from "zod";
import { CreateUsuarioDto } from "../DTOs/usuario.dto";
import { UpdateUsuarioDto } from "../DTOs/usuario.dto";
import { AppError } from "../utils/app-error";
import { da } from "zod/locales";
import { connect } from "node:http2";

export const usuarioService = {
    async listar() {
        return await prisma.user.findMany();
    },
    async get(id: number) {
        return await prisma.user.findUnique({ where: { id: id } })
    },
    async crear(data: CreateUsuarioDto){
        return prisma.user.create({
            data:{
                nombre: data.nombre,
                apellido: data.apellido,
                email: data.email,
                password: data.password,
                telefono: data.telefono,
                isActive: data.isActive,
            }
        })
    },

    async actualizar(id: number, data: UpdateUsuarioDto){
        await this.get(id)
        return prisma.user.update({
            where: { id },
            data:{
                nombre: data.nombre,
                apellido: data.apellido,
                email: data.email,
                password: data.password,
                telefono: data.telefono,
                isActive: data.isActive,
            }
        })
    }

};