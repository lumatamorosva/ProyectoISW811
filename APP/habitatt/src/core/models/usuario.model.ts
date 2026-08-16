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
export interface usuarioUpdateDto{
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    isActive: boolean;
    role: string;
    foto: string;
}

export interface usuarioFormModel{
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    isActive: boolean;
    role: string;
    foto: string;
}

//Para el login:
export interface LoginRequest {
    email: string;
    password: string;
}
export interface LoginResult {
    token: string;
}
export interface RegisterRequest {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    isActive: boolean;
    role: string;
    foto: string;
}