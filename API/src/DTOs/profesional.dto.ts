import { z } from "zod";
export const createProfesionalSchema = z.object({
    nombre: z
        .string().trim().min(3, "El nombre debe tener al menos 3 caracteres").max(120, "El nombre no puede superar 120 caracteres"),
    apellido: z
        .string().trim().min(3, "El apellido debe tener al menos 3 caracteres").max(120, "El apellido no puede superar 120 caracteres"),
    email: z
        .string().trim().email("Formato invalido").max(150, "El correo no puede superar 150 caracteres"),
    telefono: z
        .string().trim().optional(),
    titulo: z
        .string().trim().min(3, "El título debe tener al menos 3 caracteres").max(120, "El título no puede superar 120 caracteres"),
    expAnnos: z.number(),
    ubicacion: z
        .string().trim().min(3, "La ubicación debe tener al menos 3 caracteres").max(500, "La ubicación no puede superar 500 caracteres"),
    isActive: z.boolean().optional(),
    
    citas: z
        .array(z.object({citaId: z.number().int().positive(),})).optional(),
    especialidades: z
        .array(z.object({especialidadId: z.number().int().positive(),})).optional(),
    servicios: z
        .array(z.object({servicioId: z.number().int().positive(),})).optional(),
});
export const updateProfesionalSchema = createProfesionalSchema.partial();
export type CreateProfesionalDto = z.infer<typeof createProfesionalSchema>;
export type UpdateProfesionalDto = z.infer<typeof updateProfesionalSchema>;