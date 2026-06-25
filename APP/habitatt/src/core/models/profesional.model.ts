export interface Profesional{
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    titulo: string;
    expAnnos: number;
    ubicacion: string;
    isActive: boolean;

    createdAt: string;
    updatedAt: string;
}

export interface ProfesionaCreateDto{
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    titulo: string;
    expAnnos: number;
    ubicacion: string;
    isActive: boolean;
}

export interface ProfesionalUpdateDto{
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    titulo: string;
    expAnnos: number;
    ubicacion: string;
    isActive: boolean;
}