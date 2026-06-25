export interface usuario{
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    telefono: string;
    isActive: boolean;
    role: string;
    foto: string;
}
export interface usuarioCreateDto{
    id: number;
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
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    telefono: string;
    isActive: boolean;
    role: string;
    foto: string;
}