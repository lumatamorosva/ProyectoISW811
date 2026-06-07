import { prisma } from "../config/prisma";
export const usuarioService = {
    async listar() {
        return await prisma.user.findMany();
    },
    async get(id: number) { 
            return await prisma.user.findUnique({where: {id:id}})
    },

};