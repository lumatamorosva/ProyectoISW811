import { z } from "zod";
export const createCategoriaSchema = z.object({
    nombre: z
        .string().trim().min(3, "El nombre debe tener al menos 3 caracteres").max(120, "El nombre no puede superar 120 caracteres"),
    descripcion: z
        .string().trim().min(3, "La descripción debe tener al menos 3 caracteres").max(500, "La descripción no puede superar 500 caracteres"),
    isActive: z.boolean().optional(),
    
});
export const updateCategoriaSchema = createCategoriaSchema.partial();
export type CreateCategoriaDto = z.infer<typeof createCategoriaSchema>;
export type UpdateCategoriaDto = z.infer<typeof updateCategoriaSchema>;