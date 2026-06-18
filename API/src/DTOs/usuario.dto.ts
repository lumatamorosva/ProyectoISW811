import { z } from "zod";
import { Role } from "../../generated/prisma/enums";
export const createUsuarioSchema = z.object({
    nombre: z
        .string().trim().min(3, "El nombre debe tener al menos 3 caracteres").max(120, "El nombre no puede superar 120 caracteres"),
    apellido: z
        .string().trim().min(3, "El apellido debe tener al menos 3 caracteres").max(120, "El apellido no puede superar 120 caracteres"),
    email: z
        .string().trim().email("Formato invalido").max(150, "El correo no puede superar 150 caracteres"),
    password: z
        .string().trim().min(6, "La contraseña debe tener al menos 6 caracteres").max(255, "La contraseña no puede superar 255 caracteres"),
    telefono: z
        .string().trim().optional(),
    role: z
        .object({Role: z.nativeEnum(Role).default(Role.USER)}).optional(),
    isActive: z.boolean().optional(),
    
    citas: z
        .array(z.object({citaId: z.number().int().positive(),})).optional(),
});
export const updateUsuarioSchema = createUsuarioSchema.partial();
export type CreateUsuarioDto = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioDto = z.infer<typeof updateUsuarioSchema>;