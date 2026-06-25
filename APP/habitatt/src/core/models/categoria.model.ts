export interface Categoria{
    id: number;
    nombre: string;
    descripcion: string;
    isActive: boolean;

    createdAt: string;
    updatedAt: string;
}

export interface CategoriaCreateDto{
    id: number;
    nombre: string;
    descripcion: string;
    isActive: boolean;
}

export interface CategoriaUpdateDto{
    id: number;
    nombre: string;
    descripcion: string;
    isActive: boolean;
}