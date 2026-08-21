import { Especialidad } from "./especialidad.model";

export interface profesional{
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    titulo: string;
    expAnnos: number;
    ubicacion: string;
    modalidad: string;
    tarifaBase: number;
    isActive: boolean;
    isAvailable: boolean;
    foto: string;
    especialidades: { especialidadId: number }[];

    createdAt: string;
    updatedAt: string;
}

export interface ProfesionaCreateDto{
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    titulo: string;
    expAnnos: number;
    ubicacion: string;
    modalidad: string;
    tarifaBase: number;
    isActive: boolean;
    isAvailable: boolean;
    foto: string;

    especialidades: { especialidadId: number }[];
}

export interface ProfesionalUpdateDto{
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    titulo: string;
    expAnnos: number;
    ubicacion: string;
    modalidad: string;
    tarifaBase: number;
    isActive: boolean;
    isAvailable: boolean;
    foto: string;

    especialidades: { especialidadId: number }[];
}

export interface ProfesionalFormModel{
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    titulo: string;
    expAnnos: number;
    ubicacion: string;
    modalidad: string;
    tarifaBase: number;
    isActive: boolean;
    isAvailable: boolean;
    foto: string;

    especialidades: { especialidadId: number }[];
}

