export interface Especialidad{
    id: number;
    nombre: string;
    descripcion: string;
    isActive: boolean;
    precioBase: number;

    createdAt: string;
    updatedAt: string;
}

export interface EspecialidadCreateDto{
    nombre: string;
    descripcion: string;
    isActive: boolean;
    precioBase: number;
}

export interface EspecialidadUpdateDto{
    nombre: string;
    descripcion: string;
    isActive: boolean;
    precioBase: number;
}

export interface EspecialidadFormModel{
    nombre: string;
    descripcion: string;
    isActive: boolean;
    precioBase: number;
}