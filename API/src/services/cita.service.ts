import { prisma } from "../config/prisma";
import { CreateCitaDto, UpdateCitaDto } from "../DTOs/cita.dto";
import { AppointmentStatus, Modality } from "../../generated/prisma/enums";

export const citaService = {
    async listar() {
        return await prisma.appointment.findMany();
    },
    async get(id: number) {
        return await prisma.appointment.findUnique({ where: { id: id } })
    },
    async crear(data: CreateCitaDto){
        return prisma.appointment.create({
            data:{
                fecha: data.fecha,
                descripcion: data.descripcion,
                hora: data.hora,
                status: data.status ? data.status : AppointmentStatus.PENDING,
                modalidad: data.modality ? data.modality : Modality.PRESENCIAL,

                cliente: {connect: {id:data.clienteID}},
                profesional: {connect: {id: data.profesionalID}}
            }
        })
    },

    async actualizar(id: number, data: UpdateCitaDto){
        await this.get(id)
        return prisma.appointment.update({
            where: { id },
            data:{
                fecha: data.fecha,
                descripcion: data.descripcion,
                hora: data.hora,
                status: data.status ? data.status : AppointmentStatus.PENDING,
                modalidad: data.modality ? data.modality : Modality.PRESENCIAL,

                cliente: data.clienteID? {connect: {id:data.clienteID}} : undefined,
                profesional: data.profesionalID ? {connect: {id: data.profesionalID}} : undefined,
            }
        })
    }

};