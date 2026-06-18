import { prisma } from "../config/prisma";
import { CreateCategoriaDto, UpdateCategoriaDto } from "../DTOs/categoria.dto";

export const CategoriasService = {
    async listar() {
        return await prisma.category.findMany();
    },
    async get(id: number) {
        return await prisma.category.findUnique({ where: { id: id } })
    },
    async crear(data: CreateCategoriaDto){
        return prisma.category.create({
            data:{
                nombre: data.nombre,
                descripcion: data.descripcion,
                isActive: data.isActive,
            }
        })
    },

    async actualizar(id: number, data: UpdateCategoriaDto){
        await this.get(id)
        return prisma.category.update({
            where: { id },
            data:{
                nombre: data.nombre,
                descripcion: data.descripcion,
                isActive: data.isActive,
            }
        })
    }

};