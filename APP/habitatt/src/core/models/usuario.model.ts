export interface usuario{
    id: number;
    nombre: string;
    apellido: string;
    email?: string;
    password?: string;
    telefono?: string;
    isActive: boolean;
    role: string;
    foto: string;
}
export interface usuarioCreateDto{
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    telefono: string;
    isActive: boolean;
    role: string;
    foto: string;
}
export interface usuarioUpdateDto{
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    telefono: string;
    isActive: boolean;
    role: string;
    foto: string;
}

export interface usuarioFormModel{
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    telefono: string;
    isActive: boolean;
    role: string;
    foto: string;
}