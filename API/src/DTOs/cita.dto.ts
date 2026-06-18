import { optional, z } from "zod";
import { Role } from "../../generated/prisma/enums";
import { AppointmentStatus } from "../../generated/prisma/enums";
export const createCitaSchema = z.object({
    fecha: z
        .date(),
    descripcion: z
        .string().trim().min(3, "La descripción debe tener al menos 3 caracteres").max(500, "La descripción no puede superar 500 caracteres"),
    hora: z
        .string().trim(),
    status: z.enum( ["PENDING", "BOOKED", "CANCELLED"]).optional(),
    modality: z.enum(["VIRTUAL", "PRESENCIAL", "MIXTA"]).optional(),
    
    clienteID: z.number().int().positive().optional(),
    profesionalID: z.number().int().positive().optional(),
});
export const updateCitaSchema = createCitaSchema.partial();
export type CreateCitaDto = z.infer<typeof createCitaSchema>;
export type UpdateCitaDto = z.infer<typeof updateCitaSchema>;