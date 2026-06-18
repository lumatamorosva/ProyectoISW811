import { z } from "zod";
export const createEspecialidadSchema = z.object({
    nombre: z
        .string().trim().min(3, "El nombre debe tener al menos 3 caracteres").max(120, "El nombre no puede superar 120 caracteres"),
    descripcion: z
        .string().trim().min(3, "La descripción debe tener al menos 3 caracteres").max(500, "La descripción no puede superar 500 caracteres"),
        precioBase: z.number(),
    isActive: z.boolean().optional(),
});
export const updateEspecialidadSchema = createEspecialidadSchema.partial();
export type CreateEspecialidadDto = z.infer<typeof createEspecialidadSchema>;
export type UpdateEspecialidadDto = z.infer<typeof updateEspecialidadSchema>;