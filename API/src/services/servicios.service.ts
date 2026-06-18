import { Modality } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma";
import { CreateServicioDto, UpdateServicioDto } from "../DTOs/servicio.dto";

export const serviciosService = {
    async listar() {
        return await prisma.service.findMany();
    },
    async get(id: number) {
        return await prisma.service.findUnique({ where: { id: id } })
    },
    async crear(data: CreateServicioDto){
        return prisma.service.create({
            data:{
                nombre: data.nombre,
                descripcion: data.descripcion,
                precio: data.precio? data.precio : 0,
                duracionMinutoss: data.duracionMinutos? data.duracionMinutos : 0,
                isActive: data.isActive,
                modality: data.modality ? data.modality : Modality.PRESENCIAL,

                profesional: { connect: { id: data.profesionalId } },
                categoria: { connect: { id: data.categoriaId } },
            }
        })
    },

    async actualizar(id: number, data: UpdateServicioDto){
        await this.get(id)
        return prisma.service.update({
            where: { id },
            data:{
                nombre: data.nombre,
                descripcion: data.descripcion,
                precio: data.precio? data.precio : 0,
                duracionMinutoss: data.duracionMinutos? data.duracionMinutos : 0,
                isActive: data.isActive,
                modality: data.modality ? data.modality : Modality.PRESENCIAL,

                profesional: data.profesionalId? { connect: { id: data.profesionalId } } : undefined,
                categoria: data.categoriaId? { connect: { id: data.categoriaId } } : undefined,
            }
        })
    }

};