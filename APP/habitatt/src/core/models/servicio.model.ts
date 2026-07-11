import { CategoriaService } from "../services/categoria.service";
import { profesional } from "../models/profesional.model";

export interface Servicio{
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    duracionMinutoss: number;
    isActive: boolean;
    modality: string;

    categoriaId: number;
    categoria?: CategoriaService;

    profesionalId: number;
    profesional?: profesional;

    createdAt: string;
    updatedAt: string;

    //Agregado solo para la vista:
    nombreProfesional?: string;
    nombreCategoria?: string;
}

export interface ServicioCreateDto{
    nombre: string;
    descripcion: string;
    precio: number;
    duracionMinutos: number;
    isActive: boolean;
modality: string;

    categoriaId: number;
    categoria?: CategoriaService;

    profesionalId: number;
    profesional?: profesional;
}

export interface ServicioUpdateDto{
    nombre: string;
    descripcion: string;
    precio: number;
    duracionMinutos: number;
    isActive: boolean;
    modality: string;

    categoriaId: number;
    categoria?: CategoriaService;

    profesionalId: number;
    profesional?: profesional;
}

export interface ServicioFormModel{
    nombre: string;
    descripcion: string;
    precio: number;
    duracionMinutos: number;
    isActive: boolean;
    modality: string;

    categoriaId: number;
    categoria?: CategoriaService;

    profesionalId: number;
    profesional?: profesional;
}
