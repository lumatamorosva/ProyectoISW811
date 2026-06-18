import { z } from "zod";
import { Modality } from "../../generated/prisma/enums";
export const createServicioSchema = z.object({
    nombre: z
        .string().trim().min(3, "El nombre debe tener al menos 3 caracteres").max(120, "El nombre no puede superar 120 caracteres"),
    descripcion: z
        .string().trim().min(3, "La descripción debe tener al menos 3 caracteres").max(500, "La descripción no puede superar 500 caracteres"),
    precio: z.number(),
    duracionMinutos: z.number(),
    isActive: z.boolean().optional(),

    modality: z.enum(["VIRTUAL", "PRESENCIAL", "MIXTA"]).optional(),

    categoriaId: z.number().int().positive().optional(),
    profesionalId: z.number().int().positive().optional(),
});
export const updateServicioSchema = createServicioSchema.partial();
export type CreateServicioDto = z.infer<typeof createServicioSchema>;
export type UpdateServicioDto = z.infer<typeof updateServicioSchema>;