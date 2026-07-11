export interface categoria{
    id: number;
    nombre: string;
    descripcion: string;
    isActive: boolean;

    createdAt: string;
    updatedAt: string;
}

export interface CategoriaCreateDto{
    nombre: string;
    descripcion: string;
    isActive: boolean;
}

export interface CategoriaUpdateDto{
    nombre: string;
    descripcion: string;
    isActive: boolean;
}

export interface CategoriaFormModel{
    nombre: string;
    descripcion: string;
    isActive: boolean;
}