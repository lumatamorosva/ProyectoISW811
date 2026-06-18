import { prisma } from "../config/prisma";
import { CreateEspecialidadDto, UpdateEspecialidadDto } from "../DTOs/especialidad.dto";

export const especialidadService = {
    async listar() {
        return await prisma.specialty.findMany();
    },
    async get(id: number) {
        return await prisma.specialty.findUnique({ where: { id: id } })
    },
    async crear(data: CreateEspecialidadDto){
        return prisma.specialty.create({
            data:{
                nombre: data.nombre,
                descripcion: data.descripcion,
                isActive: data.isActive,
            }
        })
    },

    async actualizar(id: number, data: UpdateEspecialidadDto){
        await this.get(id)
        return prisma.specialty.update({
            where: { id },
            data:{
                nombre: data.nombre,
                descripcion: data.descripcion,
                isActive: data.isActive,
            }
        })
    }

};