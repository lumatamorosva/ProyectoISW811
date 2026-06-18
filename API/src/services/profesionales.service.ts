import { prisma } from "../config/prisma";
import { number } from "zod";
import { CreateProfesionalDto, createProfesionalSchema } from "../DTOs/profesional.dto";
import { UpdateProfesionalDto } from "../DTOs/profesional.dto";
import { AppError } from "../utils/app-error";
import { da } from "zod/locales";
import { connect } from "node:http2";

export const profesionalService = {
    async listar() {
        return await prisma.professional.findMany();
    },
    async get(id: number) {
        return await prisma.professional.findUnique({ where: { id: id } })
    },
    async crear(data: CreateProfesionalDto){
        return prisma.professional.create({
            data:{
                nombre: data.nombre,
                apellido: data.apellido,
                email: data.email,
                telefono: data.telefono,
                titulo: data.titulo,
                expAnnos: data.expAnnos,
                ubicacion: data.ubicacion,
                isActive: data.isActive,
            }
        })
    },

    async actualizar(id: number, data: UpdateProfesionalDto){
        await this.get(id)
        return prisma.professional.update({
            where: { id },
            data:{
                nombre: data.nombre,
                apellido: data.apellido,
                email: data.email,
                telefono: data.telefono,
                titulo: data.titulo,
                expAnnos: data.expAnnos,
                ubicacion: data.ubicacion,
                isActive: data.isActive,
            }
        })
    }

};